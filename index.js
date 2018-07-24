import React from 'react';
import { AppRegistry } from 'react-native';
import App from './components/app';

class HelloWorld extends React.Component {
    render() {
        return (
            <App />
        );
    }
}

AppRegistry.registerComponent('react1', () => HelloWorld);