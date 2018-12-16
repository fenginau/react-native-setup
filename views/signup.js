import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Container, Item, Input, Icon, Button, Text, View } from 'native-base';
import realm from '../js/realm';
import I18n from '../js/i18n';
import Color from '../js/color';
import Utils from '../js/utils';
import NavigationService from '../js/navigationservice';
import Security from '../js/security';
import Rest from '../js/rest';
import FadeInView from '../components/fadeInView';
import Dictionary from '../js/dictionary';

export default class SignupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            name: '',
            password: '',
            passwordConfirm: '',
            inputSet: [],
            inputValues: [],
        };
    }

    componentWillMount() {
        this.setForm();
        this.renderedInputs = [];
    }

    componentDidMount() {
        Security.retrieveServerRsaPublicKey();
    }

    setForm() {
        let inputSet = [
            {
                item: 'email',
                placeholder: I18n.t('email'),
                returnType: 'next',
                contentType: 'username',
                keyboardType: 'email-address',
                icon: 'ios-mail',
                secure: false,
                focus: false,
                error: false,
                errorMsg: Utils.getEmptyError('email')
            },
            {
                item: 'name',
                placeholder: I18n.t('name'),
                returnType: 'next',
                contentType: 'name',
                keyboardType: 'default',
                icon: 'ios-person',
                secure: false,
                focus: false,
                error: false,
                errorMsg: Utils.getEmptyError('name')
            }
        ];
        this.setState({ inputSet });
    }

    signin() {
        this.props.navigation.navigate('Signin');
    }

    signup() {
        if (this.state.inputValues['email'] == '') {
            let inputSet = this.state.inputSet;
            inputSet[0].error = true;
            this.setState({ inputSet });
        }
        console.log('signup');
    }

    onTextChange(text, item) {
        let values = this.state.inputValues;
        values[item] = text;
        this.setState({ inputValues: values });
    }

    onNextPress(index) {
        console.log(index);
    }

    render() {
        return (
            <Container style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require('../resourse/images/HealthKite.png')} style={styles.logoSmall} resizeMode='center' />
                </View>
                <Text style={styles.txtSignin}>{I18n.t('signup')}</Text>
                <View style={styles.form}>
                    {this.state.inputSet.map((item, index) => {
                        return (
                            <View style={styles.inputContainer}>
                                {item.error &&
                                    <Text style={styles.txtError}>{item.errorMsg}</Text>}
                                <Item regular style={styles.input} error={item.error}>
                                    <Input
                                        placeholder={item.placeholder}
                                        returnKeyType={item.returnType}
                                        onSubmitEditing={this.onNextPress.bind(this, index)}
                                        onChangeText={(text) => this.onTextChange(text, item.item)}
                                        value={this.state.inputValues[item.item]}
                                        textContentType={item.contentType}
                                        keyboardType={item.keyboardType}
                                        blurOnSubmit={false}
                                        focus />
                                    <Icon name={item.icon} />
                                </Item>
                            </View>
                        );
                    })}
                    {/* {this.state.inputError &&
                        <Text style={styles.txtError}>{this.state.errorMsg}</Text>}
                    <Item regular style={styles.input} error={this.state.inputError}>
                        <Input
                            placeholder='Email ID'
                            returnKeyType='next'
                            // onSubmitEditing={() => { this.nameInput.focus() }}
                            onChangeText={(text) => this.setState({ account: text, inputError: false })}
                            value={this.state.account}
                            textContentType='username'
                            keyboardType='email-address'
                            blurOnSubmit={false} />
                        <Icon name='ios-mail' />
                    </Item>
                    <Item regular style={styles.input} error={this.state.inputError}>
                        <Input
                            ref={(input) => { this.nameInput = input; }}
                            placeholder='Name'
                            returnKeyType='next'
                            // onSubmitEditing={this.nextClick.bind(this)}
                            onChangeText={(text) => this.setState({ account: text, inputError: false })}
                            value={this.state.account}
                            textContentType='name'
                            keyboardType='default' />
                        <Icon name='ios-person' />
                    </Item> */}
                    <Button iconRight block transparent onPress={this.signup.bind(this)} style={styles.btnRegister}>
                        <Text>{I18n.t('signup')}</Text>
                        <Icon name='ios-arrow-forward' />
                    </Button>
                    <Text style={styles.txtSignup}>{I18n.t('haveAccountMessage')}</Text>
                    <Button transparent onPress={this.signin.bind(this)} style={styles.btnSignup}>
                        <Text>{I18n.t('signinAct')}</Text>
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
        backgroundColor: Color.Eve
    },
    form: {
        textAlign: 'center',
        alignItems: 'center',
        width: 300,
    },
    inputContainer: {
        alignSelf: 'stretch'
    },
    input: {
        backgroundColor: Color.White,
        opacity: 0.4,
        marginBottom: 16
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
    logoSmall: {
        width: 250,
        marginTop: 100,
        marginBottom: 100
    },
    logoContainer: {
        height: 300,
        justifyContent: 'center'
    },
    formContainer: {
        flex: 0.5,
        justifyContent: 'flex-start',
    }
});