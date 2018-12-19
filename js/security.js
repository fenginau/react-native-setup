import React from 'react';
import JSEncrypt from 'jsencrypt';
import LocalDB from './localDb';
import Dictionary from './dictionary';
import Rest from './rest';
import CryptoJS from 'crypto-js';

export default class Security extends React.Component {
    static rsaKeyType = Dictionary.rsaKeyType;
    static generateLocalRsaKey() {
        let encrypt = new JSEncrypt({ default_key_size: 2048 });
        let publicKey = encrypt.getPublicKey();
        let privateKey = encrypt.getPrivateKey();
        LocalDB.saveList('RsaKey', [
            { type: this.rsaKeyType.ClientPublic, key: publicKey },
            { type: this.rsaKeyType.ClientPrivate, key: privateKey }
        ]);
    }

    static retrieveServerRsaPublicKey() {
        LocalDB.clearALL();
        Rest.getServerRsaPublicKey().then(result => {
            LocalDB.save('RsaKey', { type: this.rsaKeyType.ServerPublic, key: result });
        }).catch(e => {
            console.error('Failed to retrieve server public key.');
            console.error(e);
        });
    }

    static saveUserSecurityKeys(account, keys) {
        LocalDB.save('UserSecurity', {
            account: account.toLowerCase(),
            rsaPublicKey: keys.userRsaPublicKey,
            aesKey: this.rsaDecript(keys.userAesKey),
            salt: this.rsaDecript(keys.salt)
        });
    }

    static getLocalRsaPublicKey() {
        try {
            let result = LocalDB.getItemById('RsaKey', 'type', this.rsaKeyType.ClientPublic);
            if (result.length > 0) {
                let key = result[0].key
                return key;
            } else {
                console.error('Cannot find local RSA public key.');
                return null;
            }
        } catch (e) {
            console.error('Error when trying to get local RSA public key.');
            console.error(e);
        }
    }

    static getLocalRsaPrivateKey() {
        try {
            let result = LocalDB.getItemById('RsaKey', 'type', this.rsaKeyType.ClientPrivate);
            if (result.length > 0) {
                let key = result[0].key;
                return key;
            } else {
                console.error('Cannot find local RSA private key.');
                return null;
            }
        } catch (e) {
            console.error('Error when trying to get local RSA private key.');
            console.error(e);
        }
    }

    static getServerRsaPublicKey() {
        try {
            let result = LocalDB.getItemById('RsaKey', 'type', this.rsaKeyType.ServerPublic);
            if (result.length > 0) {
                let key = result[0].key;
                return key;
            } else {
                console.error('Cannot find server RSA public key.');
                return null;
            }
        } catch (e) {
            console.error('Error when trying to get server RSA public key.');
            console.error(e);
        }
    }

    static getUserRsaPublicKey(account) {
        try {
            let result = LocalDB.getItemById('UserSecurity', 'account', account.toLowerCase());
            if (result.length > 0) {
                let key = result[0].rsaPublicKey;
                return key;
            } else {
                console.error('Cannot find user RSA public key.');
                return null;
            }
        } catch (e) {
            console.error('Error when trying to get user RSA public key.');
            console.error(e);
        }
    }

    static getUserAesKey(account) {
        try {
            let result = LocalDB.getItemById('UserSecurity', 'account', account.toLowerCase());
            if (result.length > 0) {
                let key = result[0].aesKey;
                return key;
            } else {
                console.error('Cannot find user AES key.');
                return null;
            }
        } catch (e) {
            console.error('Error when trying to get user AES key.');
            console.error(e);
        }
    }

    static getUserSalt(account) {
        try {
            let result = LocalDB.getItemById('UserSecurity', 'account', account.toLowerCase());
            if (result.length > 0) {
                let key = result[0].salt;
                return key;
            } else {
                console.error('Cannot find user salt.');
                return null;
            }
        } catch (e) {
            console.error('Error when trying to get user salt.');
            console.error(e);
        }
    }

    static requestSignin() {
        let localPublicKey = this.getLocalRsaPublicKey();
        let localPrivateKey = this.getLocalRsaPrivateKey();
        if (localPublicKey == null || localPrivateKey == null) {
            this.generateLocalRsaKey();
        }
    }

    static rsaEncryptByServerKey(plainText) {
        let key = this.getServerRsaPublicKey();
        if (key != null) {
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(key);
            return encrypt.encrypt(plainText);
        }
        else {
            console.error('Server RSA public key not found.');
            throw 'Server RSA public key not found.';
        }
    }

    static rsaEncryptByUserKey(account, plainText) {
        let key = this.getUserRsaPublicKey(account);
        if (key != null) {
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(key);
            return encrypt.encrypt(plainText);
        }
        else {
            console.error('User RSA public key not found.');
            throw 'User RSA public key not found.';
        }
    }

    static rsaDecript(cypherText) {
        let key = this.getLocalRsaPrivateKey();
        if (key != null) {
            let decrypt = new JSEncrypt();
            decrypt.setPrivateKey(key);
            return decrypt.decrypt(cypherText);
        }
        else {
            console.error('Client RSA private key not found.');
            throw 'Client RSA private key not found.';
        }
    }

    static aesEncrypt(account, plainText) {
        let keyPair = this.getUserAesKey(account).split(':');
        let key = CryptoJS.enc.Base64.parse(keyPair[0]);
        let iv = CryptoJS.enc.Base64.parse(keyPair[1]);
        let encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.toString();
    }

    static aesDecrypt(account, cipherText) {
        let keyPair = this.getUserAesKey(account).split(':');
        let key = CryptoJS.enc.Base64.parse(keyPair[0]);
        let iv = CryptoJS.enc.Base64.parse(keyPair[1]);
        let decrypted = CryptoJS.AES.decrypt(cipherText, key, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return decrypted.toString(CryptoJS.enc.Utf8)
    }

    static sha256(account, plainText) {
        let text = `${plainText}${this.getUserSalt(account)}`;
        return CryptoJS.SHA256(text).toString(CryptoJS.enc.Base64);
    }

    static saveJwt(jwt) {
        return LocalDB.save('Jwt', { ac: 1, token: jwt }, true);
    }

    static getJwt() {
        try {
            let jwt = LocalDB.getItemById('Jwt', 'ac', 1);
            console.log(jwt);
            console.log(LocalDB.getJwt());
        } catch (e) {
            console.error('Failed to get JWT token.');
            console.error(e);
        }
    }
}