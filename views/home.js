import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Container, Header, List, ListItem, Item, Input, Icon, Button, Text, Toast, Left, Body, View, Spinner, Right } from 'native-base';
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
            end: false
        };
    }

    componentDidMount() {
        realm.write(() => {
            // realm.deleteAll();
            this.setState({ realm });
        });
        this.getSearchHistory();
    }

    getSearchHistory() {
        let history = [
            { id: 1, subject: 'Math', location: 'Balwyn', price: '40,50', gender: 'm' },
            { id: 2, subject: 'English', location: 'Kew', price: '30,40', gender: 'f' },
            { id: 3, subject: 'Tennis', location: 'Box Hill', price: '50,60', gender: 'm' },
        ];
        this.setState({ searchHistory: history, loaded: true });
    }

    search() {

    }

    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name='ios-search' />
                        <Input
                            placeholder='Search'
                            returnKeyType='search'
                            onSubmitEditing={this.search.bind(this)}
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text} />
                    </Item>
                    <Button transparent>
                        <Text>{I18n.t('search')}</Text>
                    </Button>
                </Header>
                <Text style={styles.title}>{I18n.t('searchHistory')}</Text>
                {this.state.loaded
                    ? (<List dataArray={this.state.searchHistory}
                            renderRow={(item) =>
                                <ListItem style={styles.row}>
                                    <View style={styles.row}>
                                        <View style={[styles.row, {flex: 0.5}]}>
                                            <Icon style={styles.listIcon} name='ios-book' />
                                            <Text>{item.subject}</Text>
                                        </View>
                                        <View style={[styles.row, {flex: 0.5}]}>
                                            <Icon style={styles.listIcon} name='location-pin' type='Entypo' />
                                            <Text>{item.location}</Text>
                                        </View>
                                    </View>
                                    <Icon style={styles.listIcon} name='ios-search' />
                                </ListItem>
                            }></List>)
                    : (<Spinner color='blue' />)
                }
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    listIcon: {
        fontSize: 24,
        color: Color.LightGrey,
        marginLeft: 10,
        marginRight: 10
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