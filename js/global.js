import React from 'react';
import { Base64 } from 'js-base64';
import DeviceInfo from 'react-native-device-info';

export default class Global extends React.Component {
    static nsServer = 'https://careintheclouds.com.au/ns'; //no / at the end
    static hardwareId = '9E61319A-2E42-48FB-A246-E95E61012220';
    static loginCode = '7525';
    static fcmToken = '';
    static deviceModel = DeviceInfo.getModel();
    static getBase64Auth() {
        return 'Basic ' +  Base64.encode(this.hardwareId + ':' + this.loginCode);
    }
}