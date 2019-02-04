import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { StyleProvider } from 'native-base';
import Navigator from './navigator';
import { Root } from "native-base";
import firebase, { RemoteMessage } from 'react-native-firebase';
import Global from '../js/global';
import NavigationService from '../js/navigationservice';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
// import platform from '../native-base-theme/variables/platform';
// import commonColor from '../native-base-theme/variables/commonColor';

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
                            NavigationService.navigate('Home');
                        });
                }
            });
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => { });
        this.messageListener = firebase.messaging().onMessage((message) => {
            switch (message.data.type) {
                case 'video':
                    console.log('msg receiveddddddddd');
                    NavigationService.navigate('Video');
                    break;
                case 'message':
                    DeviceEventEmitter.emit('newMessageReceived', message);
                    break;
            }
        });
    }

    componentWillUnmount() {
        this.onTokenRefreshListener();
        this.messageListener();
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Root>
                    <Navigator ref={ref => NavigationService.setTopLevelNavigator(ref)} />
                </Root>
            </StyleProvider>
        );
    }
}
