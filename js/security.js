import React from 'react';
import JSEncrypt from 'jsencrypt';
import LocalDB from './localDb';
import Dictionary from './dictionary';
import Rest from './rest';
import CryptoJS from 'crypto-js/core';
import Cipher from 'crypto-js/cipher-core';
import AES from 'crypto-js/aes';
import ECB from 'crypto-js/mode-ecb';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';

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
            salt: keys.salt
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
        console.log(key);
        let iv = CryptoJS.enc.Base64.parse(keyPair[1]);
        console.log(iv);

        let encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        console.log(encrypted.toString());
    }
}