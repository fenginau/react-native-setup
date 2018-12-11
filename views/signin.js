import React from 'react';
import { StyleSheet, Keyboard, ScrollView, BackHandler } from 'react-native';
import { Container, Item, Input, Icon, Button, Text } from 'native-base';
import realm from '../js/realm';
import RNFS from 'react-native-fs';
import RNVideo from 'videomodule';
import I18n from '../js/i18n';
import Color from '../js/color';
import NavigationService from '../js/navigationservice';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            realm: null,
            loaded: false,
            text: '',
            searchHistory: [],
            refreshing: false,
            end: false,
            subjects: [],
            isSearch: false
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <Container styke={styles.container}>
                <Item rounded>
                    <Input />
                </Item>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        textAlign: 'left',
        margin: 10,
        color: Color.Grey
    },
    row: {
        flexDirection: 'row',
        flex: 1
    }
});