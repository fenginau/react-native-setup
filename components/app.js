import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import Navigator from './navigator';
import { Root } from "native-base";
import firebase, { RemoteMessage } from 'react-native-firebase';
import Global from '../js/global';

export default class App extends React.Component {
    componentDidMount() {
        //firebase setup
        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    Global.fcmToken = fcmToken;
                } else {
                    // user doesn't have a device token yet
                }
            });

        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    // user has permissions
                    console.log('permission enabled');
                } else {
                    // user doesn't have permission
                    firebase.messaging().requestPermission()
                        .then(() => {
                            // User has authorised  
                            console.log('permission granted');
                        })
                        .catch(error => {
                            // User has rejected permissions
                            Alert.alert('Permission is required for this module.');
                            this.props.navigation.push('Home');
                        });
                }
            });
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => { });
        this.messageListener = firebase.messaging().onMessage((message) => {
            DeviceEventEmitter.emit('newMessageReceived', message);
        });
    }

    componentWillUnmount() {
        this.onTokenRefreshListener();
        this.messageListener();
    }

    render() {
        return (
            <Root>
                <Navigator />
            </Root>
        );
    }
}
