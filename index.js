import React from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import Navigator from './components/navigator';

class HelloWorld extends React.Component {
  render() {
    return (
      <Navigator />
    );
  }
}

AppRegistry.registerComponent('MyReactNativeApp', () => HelloWorld);