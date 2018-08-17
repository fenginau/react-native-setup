import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import realm from '../js/realm';
import RNFS from 'react-native-fs';
import RNVideo from 'videomodule';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            realm: null,
            loaded: false
        };
    }

    componentDidMount() {
        realm.write(() => {
            // realm.deleteAll();
            realm.create('Cat', { name: 'PP' });
            this.setState({ realm });
        });

    }

    render() {
        const info = this.state.realm
            ? 'Cats: ' + this.state.realm.objects('Cat').length + 'Info:' + this.state.realm.objects('InfoSimple').length
            : 'Loading...';
        return (
            <View style={styles.container}>
                <Text style={styles.hello}>{info}</Text>
                <Button onPress={() => {
                    RNVideo.show('Awesome', RNVideo.SHORT);
                }} title="Press Me" />
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