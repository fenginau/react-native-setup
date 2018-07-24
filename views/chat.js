import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: {}
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.hello}>This is chat screen</Text>
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