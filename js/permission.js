import React from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

export default class Permission extends React.Component {
    static getPermissionByKeys(keys) {
        var permissions = [];
        for (let key of keys) {
            if (PermissionsAndroid.PERMISSIONS[key] != undefined) {
                permissions.push(PermissionsAndroid.PERMISSIONS[key]);
            }
        }
        return permissions;
    }

    static requestPermission(keys) {
        return new Promise(async (resolve, reject) => {
            try {
                var allGranted = true;
                if (Platform.OS == 'android') {
                    let permissions = this.getPermissionByKeys(keys);
                    const granted = await PermissionsAndroid.requestMultiple(permissions)
                    var allGranted = true;
                    for (let permission of permissions) {
                        if (granted[permission] != PermissionsAndroid.RESULTS.GRANTED) {
                            allGranted = false;
                            break;
                        }
                    }
                }
                
                if (allGranted) {
                    resolve();
                } else {
                    reject('Permission Rejected');
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}


