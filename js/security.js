import React from 'react';
import JSEncrypt from 'jsencrypt';
import LocalDB from './localDb';
import Dictionary from './dictionary';
import Rest from './rest';

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

    static getUserRsaPublicKey() {
        try {
            let result = LocalDB.getItemById('RsaKey', 'type', this.rsaKeyType.UserPublic);
            if (result.length > 0) {
                let key = result[0].key;
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

    static requestSignin() {
        let localPublicKey = this.getLocalRsaPublicKey();
        let localPrivateKey = this.getLocalRsaPrivateKey();
        if (localPublicKey == null || localPrivateKey == null) {
            this.generateLocalRsaKey();
        }
    }

    static rsaEncryptByServerKey(plainText) {
        var key = this.getServerRsaPublicKey();
        if (key != null) {
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(key);
            return encrypt.encrypt(plainText);
        }
        else {
            console.error('Server RSA public not found.');
            throw 'Server RSA public not found.';
        }
    }

    static rsaEncryptByUserKey(plainText) {
        var key = this.getUserRsaPublicKey();
        if (key != null) {
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(key);
            return encrypt.encrypt(plainText);
        }
        else {
            console.error('User RSA public not found.');
            throw 'User RSA public not found.';
        }
    }

    static rsaDecript(cypherText) {
        var key = this.getLocalRsaPrivateKey();
        if (key != null) {
            var decrypt = new JSEncrypt();
            decrypt.setPrivateKey(key);
            return encrypt.decrypt(plainText);
        }
        else {
            console.error('Client RSA private not found.');
            throw 'Client RSA public not found.';
        }
    }
}