import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import realm from '../js/realm';
import RNFS from 'react-native-fs';
import RNVideo from 'videomodule';
import NavigationService from '../js/navigationservice';

export default class ItemEditScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            realm: null,
            loaded: false
        };
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.hello}></Text>
                <Button onPress={() => {
                    NavigationService.navigate('Video');
                }} title="Press Me" />
            </View>
        );
    }
}
const styles = StyleSheet.create({
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