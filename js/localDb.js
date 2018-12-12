import React from 'react';
import realm from './realm';

export default class LocalDB extends React.Component {
    static initContext() {
        realm.write(() => {
            realm.deleteAll();
        });
    }

    static save(name, object, isUpdate = true) {
        return new Promise(async (resolve, reject) => {
            try {
                realm.write(() => {
                    realm.create(name, object, isUpdate);
                });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    static saveList(name, objectList, isUpdate = true) {
        return new Promise(async (resolve, reject) => {
            try {
                realm.write(() => {
                    if (Array.isArray(objectList)) {
                        objectList.forEach(o => {
                            realm.create(name, o, isUpdate);
                        });
                    } else {
                        reject('The passed object is not a list.');
                    }
                });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    static getItemById(name, idName, id) {
        return realm.objects(name).filtered(`${idName} = "${id}"`);
    }
}