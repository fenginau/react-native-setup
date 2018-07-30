import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { RNCamera } from 'react-native-camera'

export default class SettingScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Button
                    onPress={() => {
                        this.props.navigation.navigate('Camera');
                    }}
                    title="Take photo"
                    color="#841584"
                    accessibilityLabel="Take a photo." />
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