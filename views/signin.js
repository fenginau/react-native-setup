import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Container, Item, Input, Icon, Button, Text, View } from 'native-base';
import realm from '../js/realm';
import I18n from '../js/i18n';
import Color from '../js/color';
import NavigationService from '../js/navigationservice';
import Security from '../js/security';

export default class SigninScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            inputError: false
        };
    }

    componentDidMount() {
        Security.retrieveServerRsaPublicKey();
    }

    nextClick() {
        let account = this.state.account;
        if (account == '') {
            this.setState({ inputError: true });
            return;
        }
        let signinRequest = {
            userName: Security.rsaEncryptByServerKey(account),
            clientRsaPublicKey: Security.getLocalRsaPublicKey()
        }
        console.log(signinRequest);
    }

    signup() {
        console.log(Security.getLocalRsaPrivateKey());
    }

    render() {
        return (
            <Container style={styles.container}>
                <Image source={require('../resourse/images/HealthKite.png')} style={styles.logo} resizeMode='center' />
                <View style={styles.form}>
                    <Text style={styles.txtSignin}>{I18n.t('signin')}</Text>
                    {this.state.inputError &&
                        <Text style={styles.txtError}>{I18n.t('accountEmptyError')}</Text>}
                    <Item regular style={styles.input} error={this.state.inputError}>
                        <Input
                            placeholder='Account'
                            returnKeyType='next'
                            onSubmitEditing={this.nextClick.bind(this)}
                            onChangeText={(text) => this.setState({ account: text, inputError: false })}
                            value={this.state.account} />
                        {this.state.inputError &&
                            <Icon name='ios-close-circle' />}
                    </Item>
                    <Button iconRight transparent onPress={this.nextClick.bind(this)} style={styles.btnNext}>
                        <Text>Next</Text>
                        <Icon name='ios-arrow-forward' />
                    </Button>
                    <Text style={styles.txtSignup}>{I18n.t('noAccountMessage')}</Text>
                    <Button transparent onPress={this.signup.bind(this)} style={styles.btnSignup}>
                        <Text>{I18n.t('signupAct')}</Text>
                    </Button>
                </View>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.Eve
    },
    form: {
        textAlign: 'center',
        alignItems: 'center',
        width: 300
    },
    input: {
        backgroundColor: Color.White
    },
    btnNext: {
        alignSelf: 'flex-end',
    },
    btnSignup: {
        alignSelf: 'center',
    },
    txtError: {
        marginBottom: 5,
        marginLeft: 5,
        color: Color.Error,
        fontSize: 14,
        alignSelf: 'flex-start',
    },
    txtSignup: {
        marginTop: 100,
    },
    txtSignin: {
        marginBottom: 10,
        color: Color.DarkGrey,
        fontSize: 18,
        alignSelf: 'flex-start',
    },
    logo: {
        width: 400
    }
});