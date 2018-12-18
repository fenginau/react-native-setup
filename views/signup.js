import React from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { Container, Item, Input, Icon, Button, Text, View, Card, CardItem, Body, Spinner } from 'native-base';
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
            loading: false
        };
    }

    componentWillMount() {
        this.setForm();
    }

    loading(loading) {
        this.setState({loading: loading});
    }

    setForm() {
        let inputSet = [
            {
                item: 'email',
                placeholder: I18n.t('email'),
                returnType: 'next',
                contentType: 'username',
                keyboardType: 'email-address',
                maxLength: 50,
                icon: 'ios-mail',
                secure: false,
                error: false,
                errorMsg: I18n.t('invalidEmail')
            },
            {
                item: 'name',
                placeholder: I18n.t('name'),
                returnType: 'next',
                contentType: 'name',
                keyboardType: 'default',
                maxLength: 20,
                icon: 'ios-person',
                secure: false,
                error: false,
                errorMsg: Utils.getEmptyError('name')
            },
            {
                item: 'password',
                placeholder: I18n.t('password'),
                returnType: 'next',
                contentType: 'password',
                keyboardType: 'default',
                maxLength: 50,
                icon: 'ios-eye',
                secure: true,
                error: false,
                errorMsg: I18n.t('invalidPassword')
            }
        ];
        this.setState({ inputSet });
    }

    signin() {
        this.props.navigation.navigate('Signin');
    }

    signup() {
        var valid = true;
        let inputSet = this.state.inputSet;
        let signipRequest = {};
        inputSet.forEach(item => {
            switch (item.item) {
                case 'password':
                    item.error = !this.checkPwd('ALL');
                    valid = valid && !item.error;
                    signipRequest.password = item.value;
                    break;
                case 'name':
                    if (!item.value) {
                        item.error = true;
                        valid = false;
                    } else {
                        item.error = false;
                    }
                    signipRequest.name = item.value;
                    break;
                case 'email':
                    item.error = !Utils.isEmail(item.value);
                    valid = valid && !item.error;
                    signipRequest.userName = item.value;
                    break;
            }
        });
        this.setState({ inputSet });
        if (valid) {
            for (let key in signipRequest) {
                signipRequest[key] = Security.rsaEncryptByServerKey(signipRequest[key]);
            }
            Rest.signup(signipRequest).then(result => {
                console.log(result);
            }).catch(e => {
                if (e == 'duplicate') {
                    // do
                }
            });
        }
    }

    onTextChange(text, index) {
        let inputSet = this.state.inputSet;
        inputSet[index].value = text;
        this.setState({ inputSet });
    }

    toggleSecureInput(index, isHide) {
        let inputSet = this.state.inputSet;
        inputSet[index].hide = isHide;
        this.setState({ inputSet });
    }

    onInputFocus(index) {
        if (this.state.inputSet[index].item == 'password') {
            this.setState({ showHint: true });
        }
    }

    onInputBlur(index) {
        let inputSet = this.state.inputSet;
        switch (inputSet[index].item) {
            case 'password':
                inputSet[index].error = !this.checkPwd('ALL');
                this.setState({ showHint: false, inputSet });
                break;
            case 'name':
                if (!inputSet[index].value) {
                    inputSet[index].error = true;
                } else {
                    inputSet[index].error = false;
                }
                this.setState({ inputSet });
                break;
            case 'email':
                inputSet[index].error = !Utils.isEmail(inputSet[index].value);
                this.setState({ inputSet });
                break;
        }
    }

    checkPwd(rule) {
        let pwd = !this.state.inputSet[2].value ? '' : this.state.inputSet[2].value;
        switch (rule) {
            case 'UC':
                return pwd.search(/[A-Z]/) > -1;
            case 'LC':
                return pwd.search(/[a-z]/) > -1;
            case 'NO':
                return pwd.search(/[0-9]/) > -1;
            case 'LEN':
                return pwd.length > 7;
            case 'ALL':
                return pwd.search(/[A-Z]/) > -1 && pwd.search(/[a-z]/) > -1 && pwd.search(/[0-9]/) > -1 && pwd.length > 7;
            default:
                return false;
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <ScrollView style={styles.scrollView} scrollEnabled={false}>
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
                                            onChangeText={(text) => this.onTextChange(text, index)}
                                            value={this.state.inputSet[index].value}
                                            textContentType={item.contentType}
                                            keyboardType={item.keyboardType}
                                            maxLength={item.maxLength}
                                            blurOnSubmit={false}
                                            secureTextEntry={item.secure && !item.show}
                                            onFocus={this.onInputFocus.bind(this, index)}
                                            onBlur={this.onInputBlur.bind(this, index)} />
                                        {!item.secure
                                            ? (<Icon name={item.icon} />)
                                            : this.state.inputSet[index].show
                                                ? <Icon name='ios-eye' onPress={this.toggleSecureInput.bind(this, index, true)} />
                                                : <Icon name='ios-eye-off' onPress={this.toggleSecureInput.bind(this, index, false)} />}
                                    </Item>
                                </View>
                            );
                        })}
                        <Button iconRight block transparent onPress={this.signup.bind(this)} style={styles.btnRegister}>
                            <Text>{I18n.t('signup')}</Text>
                            <Icon name='ios-arrow-forward' />
                        </Button>
                        <Text style={styles.txtSignup}>{I18n.t('haveAccountMessage')}</Text>
                        <Button transparent onPress={this.signin.bind(this)} style={styles.btnSignup}>
                            <Text>{I18n.t('signinAct')}</Text>
                        </Button>
                    </View>
                    {this.state.showHint &&
                        <Card style={styles.pwdHint}>
                            <CardItem header>
                                <Text>{I18n.t('passwordIndicator')}</Text>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <View style={styles.rules}>
                                        {this.checkPwd('UC')
                                            ? <Icon name='ios-checkmark-circle' style={[styles.iconBefore, styles.iconOk]} />
                                            : <Icon name='ios-close-circle' style={[styles.iconBefore, styles.iconError]} />}
                                        <Text>{I18n.t('passwordRule1')}</Text>
                                    </View>
                                    <View style={styles.rules}>
                                        {this.checkPwd('LC')
                                            ? <Icon name='ios-checkmark-circle' style={[styles.iconBefore, styles.iconOk]} />
                                            : <Icon name='ios-close-circle' style={[styles.iconBefore, styles.iconError]} />}
                                        <Text>{I18n.t('passwordRule2')}</Text>
                                    </View>
                                    <View style={styles.rules}>
                                        {this.checkPwd('NO')
                                            ? <Icon name='ios-checkmark-circle' style={[styles.iconBefore, styles.iconOk]} />
                                            : <Icon name='ios-close-circle' style={[styles.iconBefore, styles.iconError]} />}
                                        <Text>{I18n.t('passwordRule3')}</Text>
                                    </View>
                                    <View style={styles.rules}>
                                        {this.checkPwd('LEN')
                                            ? <Icon name='ios-checkmark-circle' style={[styles.iconBefore, styles.iconOk]} />
                                            : <Icon name='ios-close-circle' style={[styles.iconBefore, styles.iconError]} />}
                                        <Text>{I18n.t('passwordRule4')}</Text>
                                    </View>
                                </Body>
                            </CardItem>
                        </Card>}
                </ScrollView>
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
        backgroundColor: Color.Eve
    },
    scrollView: {
        alignItems: 'center',
        flexDirection: 'column'
    },
    form: {
        textAlign: 'center',
        alignItems: 'center',
        width: 300,
    },
    inputContainer: {
        alignSelf: 'stretch',
        alignItems: 'stretch',
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
    },
    rules: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start'
    },
    iconBefore: {
        fontSize: 16,
        margin: 5
    },
    iconOk: {
        color: Color.Green
    },
    iconError: {
        color: Color.Error
    },
    pwdHint: {
        alignSelf: 'stretch',
        width: 298,
        position: 'relative',
        top: -520
    }
});