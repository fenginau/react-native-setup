import React from 'react';
import { Image, TouchableOpacity, TextInput } from 'react-native';
import { Container, Header, Content, Left, Body, Right, Button, Title, Icon, Text, View } from 'native-base';
import Rest from '../js/rest';
import RNFS from 'react-native-fs';
import realm from '../js/realm';
import I18n from '../js/i18n';

export default class TextInputScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: '',
            title: '',
            placeholder: '',
            description: '',
            multiline: false,
            size: 20,
            text: ''
        };
    }

    focus() {
        this.textInput && this.textInput.focus()
    }

    componentWillMount() {
        const { navigation } = this.props;
        const item = navigation.getParam('item', '');
        const title = navigation.getParam('title', '');
        const placeholder = navigation.getParam('placeholder', '');
        const description = navigation.getParam('description', '');
        const multiline = navigation.getParam('multiline', false);
        const size = navigation.getParam('size', 20);
        const text = navigation.getParam('text', '');
        this.setState({ item, title, placeholder, description, multiline, size, text });
    }

    componentDidMount() {
    }

    onSaveChange() {
        const { navigation } = this.props;
        navigation.state.params.returnData(this.state.item, this.state.text);
        navigation.goBack();
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => {this.props.navigation.goBack()}}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.state.title}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.onSaveChange.bind(this)}>
                            <Text>{I18n.t('Save')}</Text>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <TextInput
                        multiline={this.state.multiline}
                        maxLength={this.state.size}
                        style={{ flex: 1 }}
                        placeholder={this.state.placeholder}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text} />
                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }}>
                        <View style={{ flex: 0.7 }}>
                            <Text>{this.state.description}</Text>
                        </View>
                        <View style={{ flex: 0.3, alignContent: 'flex-end' }}>
                            <Text style={{textAlign: 'right'}}>{this.state.text.length} / {this.state.size}</Text>
                        </View>
                    </View>

                </Content>
            </Container>
        );
    }
}