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

const UserSecuritySchema = {
    name: 'UserSecurity',
    primaryKey: 'account',
    properties: {
        account: 'string',
        rsaPublicKey: 'string',
        aesKey: 'string',
        salt: 'string'
    }
}

const JwtSchema = {
    name: 'Jwt',
    primaryKey: 'ac',
    properties: {
        ac: 'int',
        token: 'string'        
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
        UserSecuritySchema,
        JwtSchema,
        InfoSimpleSchema,
        InfoDetailSchema,
        InfoImageStoreSchema,
        { name: 'Cat', properties: { name: 'string' } }
    ]
});

export default realm;