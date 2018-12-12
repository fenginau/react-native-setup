import React from 'react';
import Realm from 'realm';

const RsaKeySchema = {
    name: 'RsaKey',
    primaryKey: 'type',
    properties: {
        type: 'int',
        key: 'string'
    }
}

// old
const InfoSimpleSchema = {
    name: 'InfoSimple',
    primaryKey: 'id',
    properties: {
        id: 'int',
        description: 'string',
        blurb: 'string',
        headerImageUrl: 'string',
        headerImagePath: 'string',
        timestamp: 'string'
    }
};

const InfoDetailSchema = {
    name: 'InfoDetail',
    primaryKey: 'itemId',
    properties: {
        itemId: 'int',
        title: 'string',
        content: 'string',
        subId: 'int',
        subArea: 'string',
        subAreaDesc: 'string',
        week: 'int',
        parentKb: 'int',
        type: 'string',
        isHidden: 'bool',
        timestamp: 'string'
    }
};

const InfoImageStoreSchema = {
    name: 'InfoImageStore',
    primaryKey: 'id',
    properties: {
        id: 'string',
        itemId: 'int',
        order: 'int',
        localPath: 'string',
        serverPath: 'string'
    }
}

let realm = new Realm({
    schema: [
        RsaKeySchema,
        InfoSimpleSchema,
        InfoDetailSchema,
        InfoImageStoreSchema,
        { name: 'Cat', properties: { name: 'string' } }
    ]
});

export default realm;