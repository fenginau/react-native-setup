import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import { RNCamera } from 'react-native-camera'
import PhotoItem from '../components/photoitem';
import I18n from '../js/i18n';

export default class SettingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: '',
            name: '',
            desc: ''
        };
    }

    gotoTextInput(item) {
        var title, placeholder, description, multiline = false, size = 20, text;
        switch (item) {
            case 'name':
                title = I18n.t('Name');
                placeholder = I18n.t('NamePh');
                description = I18n.t('NameDesc');
                multiline = false;
                size = 20;
                text = this.state.name;
                break;
            case 'desc':
                title = I18n.t('Desc');
                placeholder = I18n.t('DescPh');
                description = I18n.t('DescDesc');
                multiline = true;
                size = 400;
                text = this.state.desc;
                break;
        }
        this.props.navigation.navigate('TextInput', {
            item,
            title,
            placeholder,
            description,
            multiline,
            size,
            text,
            returnData: this.onDataReturn.bind(this)
        });
    }

    onDataReturn(item, data) {
        switch (item) {
            case 'name':
                this.setState({ name: data });
                break;
            case 'desc':
                this.setState({ desc: data });
                break;
        }
        console.log(item, data);
    }

    render() {
        return (
            <Container>
                <Header />
                <Content>
                    <List>
                        <ListItem>
                            <Left>
                                <Text>{I18n.t('Photo')}</Text>
                            </Left>
                            <Body style={styles.listBody}>
                                <Thumbnail source={require('../resourse/images/grey.jpg')} />
                            </Body>
                        </ListItem>
                        <ListItem onPress={this.gotoTextInput.bind(this, 'name')}>
                            <Left>
                                <Text>{I18n.t('Name')}</Text>
                            </Left>
                            <Body>
                                <Text style={styles.listText}>{this.state.name}</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={this.gotoTextInput.bind(this, 'desc')}>
                            <Left>
                                <Text>{I18n.t('Desc')}</Text>
                            </Left>
                            <Body>
                                <Text style={styles.listText}>{this.state.desc}</Text>
                            </Body>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    listBody: {
        justifyContent: 'flex-end'
    },
    listText: {
        textAlign: 'right'
    },
});