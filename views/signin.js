import React from 'react';
import { StyleSheet, Image, Alert } from 'react-native';
import { Container, Item, Input, Icon, Button, Text, View, Spinner } from 'native-base';
import realm from '../js/realm';
import I18n from '../js/i18n';
import Color from '../js/color';
import NavigationService from '../js/navigationservice';
import Security from '../js/security';
import Rest from '../js/rest';
import FadeInView from '../components/fadeInView';
import Dictionary from '../js/dictionary';

export default class SigninScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
            inputError: false,
            errorMsg: '',
            step1: true,
            pwdHide: true,
            loading: false
        };
    }

    loading(loading) {
        this.setState({ loading });
    }

    nextClick() {
        let account = this.state.account;
        if (account == '') {
            this.setState({ inputError: true, errorMsg: Dictionary.errorMsg.AccountNotEmpty });
            return;
        }
        this.loading(true);

        let username = Security.rsaEncryptByServerKey(account);
        let signinRequest = {
            userName: username,
            clientRsaPublicKey: Security.getLocalRsaPublicKey()
        }

        Rest.requestSignin(signinRequest).then(result => {
            if (typeof result == 'object' && result.userRsaPublicKey != null) {
                Security.saveUserSecurityKeys(account, result);
                this.setState({ step1: false });
            } else {
                this.setState({ inputError: true, errorMsg: Dictionary.errorMsg.UserNotFound });
            }
            this.loading(false);
        });
    }

    signin() {
        let password = this.state.password;
        let account = this.state.account;
        if (password == '') {
            this.setState({ inputError: true, errorMsg: Dictionary.errorMsg.PasswordNotEmpty });
            return;
        }
        this.loading(true);
        password = Security.sha256(account, password);
        let signinRequest = {
            userName: Security.rsaEncryptByServerKey(account),
            password: Security.rsaEncryptByUserKey(account, password)
        };
        Rest.signin(signinRequest).then(result => {
            Security.saveJwt(Security.aesDecrypt(account, result)).then(() => {
                this.loading(false);
                Alert.alert('You have signed in.');
            }).catch(err => {
                console.error(err);
                this.loading(false);
            });
        }).catch(e => {
            if (e == 'unauthorised') {
                this.setState({ inputError: true, errorMsg: Dictionary.errorMsg.PasswordNotCorrect });
            }
            this.loading(false);
        });
    }

    signup() {
        this.props.navigation.navigate('Signup');
    }

    togglePassword(toggle) {
        this.setState({ pwdHide: toggle });
    }

    getInputErrorMsg(type) {
        return Dictionary.errorMsg[type];
    }

    render() {
        return (
            <Container style={styles.container}>
                <View style={styles.mainContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../resourse/images/HealthKite.png')} style={styles.logo} resizeMode='center' />
                    </View>
                    <View style={styles.formContainer}>
                        <Text style={styles.txtSignin}>{I18n.t('signin')}</Text>
                        {this.state.step1
                            ? (<View style={styles.form}>
                                {this.state.inputError &&
                                    <Text style={styles.txtError}>{this.state.errorMsg}</Text>}
                                <Item regular style={styles.input} error={this.state.inputError}>
                                    <Input
                                        placeholder='Account'
                                        returnKeyType='next'
                                        onSubmitEditing={this.nextClick.bind(this)}
                                        onChangeText={(text) => this.setState({ account: text, inputError: false })}
                                        value={this.state.account}
                                        textContentType='username'
                                        keyboardType='email-address' />
                                    {this.state.inputError &&
                                        <Icon name='ios-close-circle' />}
                                </Item>
                                <Button iconRight transparent onPress={this.nextClick.bind(this)} style={styles.btnNext}>
                                    <Text>{I18n.t('next')}</Text>
                                    <Icon name='ios-arrow-forward' />
                                </Button>
                                <Text style={styles.txtSignup}>{I18n.t('noAccountMessage')}</Text>
                                <Button transparent onPress={this.signup.bind(this)} style={styles.btnSignup}>
                                    <Text>{I18n.t('signupAct')}</Text>
                                </Button>
                            </View>)
                            : (<FadeInView style={styles.form}>
                                {this.state.inputError &&
                                    <Text style={styles.txtError}>{this.state.errorMsg}</Text>}
                                <Item regular style={styles.input} error={this.state.inputError}>
                                    <Input
                                        placeholder='Password'
                                        returnKeyType='go'
                                        onSubmitEditing={this.signin.bind(this)}
                                        onChangeText={(text) => this.setState({ password: text, inputError: false })}
                                        value={this.state.password}
                                        textContentType='password'
                                        secureTextEntry={this.state.pwdHide} />
                                    {this.state.pwdHide
                                        ? <Icon name='ios-eye' onPress={this.togglePassword.bind(this, false)} />
                                        : <Icon name='ios-eye-off' onPress={this.togglePassword.bind(this, true)} />}
                                </Item>
                                <Button iconRight transparent onPress={this.signin.bind(this)} style={styles.btnNext}>
                                    <Text>{I18n.t('go')}</Text>
                                    <Icon name='ios-arrow-forward' />
                                </Button>
                            </FadeInView>)}
                    </View>
                </View>
                {this.state.loading &&
                    <View style={styles.spinner}>
                        <Spinner color='blue' />
                    </View>}
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: Color.Eve
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        textAlign: 'center',
        alignItems: 'center',
        width: 300,
    },
    input: {
        backgroundColor: Color.White,
        opacity: 0.4
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
        fontSize: 20,
        textAlign: 'left',
        width: 300
    },
    logo: {
        width: 400,
    },
    logoContainer: {
        flex: 0.5,
        justifyContent: 'center'
    },
    formContainer: {
        flex: 0.5,
        justifyContent: 'flex-start',
    },
    spinner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: Color.White,
        opacity: 0.2,
        alignSelf: 'stretch',
        width: '100%',
        height: '100%'
    }
});