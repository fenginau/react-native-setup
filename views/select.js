import React from 'react';
import { Image, TouchableOpacity, TextInput } from 'react-native';
import { Container, Header, Content, Left, Body, Right, Button, Title, Icon, Text, View, Spinner, List, ListItem } from 'native-base';
import Rest from '../js/rest';
import RNFS from 'react-native-fs';
import realm from '../js/realm';
import I18n from '../js/i18n';
import Dictionary from '../js/dictionary';

export default class SelectScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: '',
            title: '',
            keys: [],
            multi: false,
            loaded: false
        };
    }

    focus() {
        this.textInput && this.textInput.focus()
    }

    componentWillMount() {
        const { navigation } = this.props;
        const item = navigation.getParam('item', '');
        const title = navigation.getParam('title', '');
        const keys = navigation.getParam('keys', []);
        const multi = navigation.getParam('multi', false);
        this.buildList(item)
        this.setState({ item, title, keys, multi }, () => { this.setState({ loaded: true }) });
    }

    componentDidMount() {
    }

    onSaveChange(keys) {
        const { navigation } = this.props;
        navigation.state.params.returnData(this.state.item, keys);
        navigation.goBack();
    }

    onSelect(key) {
        if (this.state.multi) {
            if (this.state.keys.includes(key)) {
                const index = this.state.keys.indexOf(key);
                let array = [...this.state.keys];
                array.splice(index, 1);
                this.setState({ keys: array });
            } else {
                this.setState({ keys: [...this.state.keys, key] });
            }
        } else {
            this.onSaveChange([key]);
        }

    }

    buildList(item) {
        var dict = Dictionary[item];
        this.tempListItems = [];

        for (let key in dict) {
            if (typeof dict[key] == 'object') {
                this.tempListItems.push(
                    <ListItem itemDivider>
                        <Text>{key}</Text>
                    </ListItem>
                );
                for (let subKey in dict[key]) {
                    this.tempListItems.push(
                        <ListItem onPress={this.onSelect.bind(this, subKey)}>
                            <Left>
                                <Text>{dict[key][subKey]}</Text>
                            </Left>
                            <Right>
                                {this.state.keys.includes(subKey) && <Icon style={{ color: 'blue' }} name='ios-checkmark-circle' />}
                            </Right>
                        </ListItem>);
                }
            } else {
                this.tempListItems.push(
                    <ListItem onPress={this.onSelect.bind(this, key)}>
                        <Left>
                            <Text>{dict[key]}</Text>
                        </Left>
                        <Right>
                            {this.state.keys.includes(key) && <Icon style={{ color: 'blue' }} name='ios-checkmark-circle' />}
                        </Right>
                    </ListItem>);
            }
        }
    }

    render() {
        if (this.state.item != '') {
            this.buildList(this.state.item);
        }

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => { this.props.navigation.goBack() }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.state.title}</Title>
                    </Body>
                    <Right>
                        {this.state.multi && (
                            <Button transparent onPress={this.onSaveChange.bind(this, this.state.keys)}>
                                <Text>{I18n.t('Save')}</Text>
                            </Button>)}
                    </Right>
                </Header>
                {this.state.loaded
                    ? (
                        <Content>
                            <List>
                                {this.tempListItems}
                            </List>
                        </Content>)
                    : (
                        <Content>
                            <Spinner color='blue' />
                        </Content>)}

            </Container>
        );
    }
}