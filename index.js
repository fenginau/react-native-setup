import React from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import Navigator from './components/navigator';
import { Root } from "native-base";

class HelloWorld extends React.Component {
    render() {
        return (
            <Root>
                <Navigator />
            </Root>
        );
    }
}

AppRegistry.registerComponent('react1', () => HelloWorld);