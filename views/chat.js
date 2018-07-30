import React from 'react';
import { StyleSheet, View, Alert, DeviceEventEmitter } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Item, Input, List, ListItem } from 'native-base';
import firebase from 'react-native-firebase';
import Global from '../js/global';
import Rest from '../js/rest';
import { GiftedChat } from 'react-native-gifted-chat'

export default class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            text: ''
        };
    }

    componentDidMount() {
        this.onNewMessageReceived = DeviceEventEmitter.addListener('newMessageReceived', (e) => {
            console.log(e.data)
            var message = {
                _id: Math.round(Math.random() * 1000000),
                text: e.data.message,
                createdAt: new Date(),
                user: {
                    _id: e.data.sender,
                    name: 'EVE',
                }
            };
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            }));
            // this.setState({ messages: [...this.state.messages, message] })
        });
    }

    componentWillUnmount() {
        this.onNewMessageReceived.remove();
    }

    send(messages = []) {
        var targets = [
            "cfOqN74UlrI:APA91bGyB6nPf8D-jFq3axXGJzr-Z-K9S_7-kf3DpI5SibnSLFi1lNAJcnPxzrUyRATpz5vPptaG-jz7DOIX6u3ensnuAxiJQv6FNFIIvzz_Su8oHKXacWY8gSFg2aUWlsYSCEGwHZLEAeZRz53tBGDvrlp4G2cMRA",
            "fLsyIBBzK1I:APA91bEqRbu8WI_0d75p07Q7uPFRPbj6Sjrpf9SYNZqz_rI2qYQq6t7f1BEbpgW6A03AplpYjPKf7RKEPPEstMnRDOiNnOaitUjGlNIayO5EbkwtYeHR_tPubpT5N55b7PRGqTkVHtcyGCaa_aXE5Zpnom14fbmsFg"
        ];
        var target = '';
        targets.forEach(t => {
            if (t != Global.fcmToken) {
                target = t;
            }
        });
        if (messages.length > 0) {
            var msg = { sender: Global.fcmToken, message: messages[0].text };
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }));
            Rest.sendMessageDirect({ ...msg, target: target });
        }
        console.log(messages);
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name='md-arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Chat with EVE</Title>
                    </Body>
                    <Right />
                </Header>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.send(messages)}
                    user={{
                        _id: Global.fcmToken,
                        name: 'Me'
                    }}
                />
            </Container >
        );
    }
}
const styles = StyleSheet.create({
    
});