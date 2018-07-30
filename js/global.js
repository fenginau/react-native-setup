import React from 'react';
import { Base64 } from 'js-base64';

export default class Global extends React.Component {
    static nsServer = 'https://careintheclouds.com.au/notificationserver-dev'; //no / at the end
    static hardwareId = '9E61319A-2E42-48FB-A246-E95E61012220';
    static loginCode = '7525';
    static fcmToken = '';
    static getBase64Auth() {
        return 'Basic ' +  Base64.encode(this.hardwareId + ':' + this.loginCode);
    }
}