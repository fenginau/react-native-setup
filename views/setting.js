import React from 'react';
import { StyleSheet, Platform, DatePickerAndroid } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, ActionSheet } from 'native-base';
import { RNCamera } from 'react-native-camera'
import Moment from 'moment';
import I18n from '../js/i18n';
import Dictionary from '../js/dictionary';
import { Item, ItemName } from '../js/item';

export default class SettingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: '',
            name: '',
            desc: '',
            region: [],
            interest: [],
            dob: null
        };
    }

    gotoTextInput(item) {
        let title, placeholder, description, multiline = false, size = 20, text;
        switch (item) {
            case Item.name:
                title = I18n.t(ItemName.name);
                placeholder = I18n.t('NamePh');
                description = I18n.t('NameDesc');
                multiline = false;
                size = 20;
                text = this.state.name;
                break;
            case Item.desc:
                title = I18n.t(ItemName.desc);
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

    gotoSelect(item) {
        let title, keys = [], multi = false;
        switch (item) {
            case Item.region:
                title = I18n.t(ItemName.region);
                break;
            case Item.interest:
                title = I18n.t(Item.interest);
                multi = true;
                break;
        }

        this.props.navigation.navigate('Select', {
            item,
            title,
            keys,
            multi,
            returnData: this.onDataReturn.bind(this)
        });
    }

    pickPhoto(item) {
        let options = [
            { text: I18n.t('Album'), icon: 'ios-images', iconColor: 'blue' },
            { text: I18n.t('Camera'), icon: 'ios-camera', iconColor: 'blue' },
            { text: I18n.t('Cancel'), icon: 'ios-close-circle', iconColor: 'red' },
        ];
        ActionSheet.show({
            options: options,
            cancelButtonIndex: 2,
            title: I18n.t('PickPhotoFrom')
        }, buttonIndex => {
            switch (buttonIndex) {
                case 0:
                    this.props.navigation.navigate('PhotoAlbum', {
                        item,
                        title: I18n.t('Album'),
                        returnData: this.onDataReturn.bind(this)
                    });
                    break;
                case 1:
                    this.props.navigation.navigate('Camera', {
                        item,
                        returnData: this.onDataReturn.bind(this)
                    });
                    break;
            }
        });
    }

    async openDataPicker(item) {
        if (Platform.OS == 'android') {
            try {
                const { action, year, month, day } = await DatePickerAndroid.open({
                    date: this.state.dob != null ? this.state.dob : new Date()
                });
                if (action !== DatePickerAndroid.dismissedAction) {
                    switch (item) {
                        case Item.dob:
                            this.setState({ dob: new Date(year, month, day) });
                            break;
                    }
                }
            } catch ({ code, message }) {
                console.warn('Cannot open date picker', message);
            }
        } else {

        }
    }

    onDataReturn(item, data) {
        switch (item) {
            case Item.name:
                this.setState({ name: data });
                break;
            case Item.desc:
                this.setState({ desc: data });
                break;
            case Item.region:
                this.setState({ region: data });
                break;
            case Item.interest:
                this.setState({ interest: data });
                break;
            case Item.photo:
                this.setState({ photo: data });
                break;
        }
        console.log(item, data);
    }

    getSelectValue(item) {
        let str = '', keys, dict;
        switch (item) {
            case Item.region:
                keys = this.state.region;
                dict = this.getSimpleDict(Dictionary[item]);
                break;
            case Item.interest:
                keys = this.state.interest;
                dict = Dictionary[item];
                break;
        }
        keys.forEach(key => {
            str = str == '' ? dict[key] : `${str}, ${dict[key]}`;
        });
        return str;
    }

    getSimpleDict(origDict) {
        let dict = {};
        for (let key in origDict) {
            dict = { ...dict, ...origDict[key] };
        }
        return dict;
    }

    render() {
        return (
            <Container>
                <Header />
                <Content>
                    <List>
                        <ListItem onPress={this.pickPhoto.bind(this, Item.photo)}>
                            <Left>
                                <Text>{I18n.t(ItemName.photo)}</Text>
                            </Left>
                            <Body>
                                <Thumbnail style={[styles.rightAlign, styles.border]} large
                                    source={this.state.photo == ''
                                        ? require('../resourse/images/grey.jpg')
                                        : { uri: this.state.photo }} />
                            </Body>
                        </ListItem>
                        <ListItem onPress={this.gotoTextInput.bind(this, Item.name)}>
                            <Left>
                                <Text>{I18n.t(ItemName.name)}</Text>
                            </Left>
                            <Body>
                                <Text style={styles.rightAlign}>{this.state.name}</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={this.gotoTextInput.bind(this, Item.desc)}>
                            <Left>
                                <Text>{I18n.t(ItemName.desc)}</Text>
                            </Left>
                            <Body>
                                <Text style={styles.rightAlign}>{this.state.desc}</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={this.gotoSelect.bind(this, Item.region)}>
                            <Left>
                                <Text>{I18n.t(ItemName.region)}</Text>
                            </Left>
                            <Body>
                                <Text style={styles.rightAlign}>{this.getSelectValue(Item.region)}</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={this.gotoSelect.bind(this, Item.interest)}>
                            <Left>
                                <Text>{I18n.t(ItemName.interest)}</Text>
                            </Left>
                            <Body>
                                <Text style={styles.rightAlign}>{this.getSelectValue(Item.interest)}</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={this.openDataPicker.bind(this, Item.dob)}>
                            <Left>
                                <Text>{I18n.t(ItemName.dob)}</Text>
                            </Left>
                            <Body>
                                <Text style={styles.rightAlign}>{this.state.dob != null && Moment(this.state.dob).format('DD MMM YYYY')}</Text>
                            </Body>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    rightAlign: {
        textAlign: 'right',
        alignSelf: 'flex-end',
    },
    border: {
        borderWidth: 3, 
        borderColor: '#e8e8e8',
    }
});