import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class SettingScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.hello}>This is setting screen</Text>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    hello: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});