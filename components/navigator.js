import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import HomeScreen from '../views/home';
import KnowledgeBaseScreen from '../views/knowledgebase';
import KnowledgebaseItemScreen from '../views/knowledgebaseitem';
import SettingScreen from '../views/setting';
import CameraScreen from '../views/camera';
import PhotoPreviewScreen from '../views/photopreview';
import ChatScreen from '../views/chat';
import TextInputScreen from '../views/textinput';
import SelectScreen from '../views/select';
import PhotoAlbumScreen from '../views/photoalbum';
import VideoResponseScreen from '../views/videoresponse';
import I18n from '../js/i18n';
import TabBarComponent from '../components/TabBarComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SigninScreen from '../views/signin';
import SignupScreen from '../views/signup';

const KnowledgeStack = createStackNavigator(
    {
        Knowledge: {
            screen: KnowledgeBaseScreen,
            navigationOptions: () => ({
                header: null
            })
        },
        KnowledgeItem: {
            screen: KnowledgebaseItemScreen,
            navigationOptions: () => ({
                header: null
            }),
        },
    },
    {
        initialRouteName: 'Knowledge',
    });

const SettingStack = createStackNavigator(
    {
        Settings: {
            screen: SettingScreen,
            navigationOptions: () => ({
                header: null
            })
        }
    },
    {
        initialRouteName: 'Settings'
    });

const CameraStack = createStackNavigator(
    {
        Camera: {
            screen: CameraScreen,
            navigationOptions: () => ({
                header: null
            })
        },
        PhotoPreview: {
            screen: PhotoPreviewScreen,
            navigationOptions: () => ({
                header: null
            }),
        },
    },
    {
        initialRouteName: 'Camera'
    });

const RootStack = createBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            title: I18n.t('search'),
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                iconName = `ios-search${focused ? '' : '-outline'}`;
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            }
        })
    },
    Knowledge: {
        screen: KnowledgeStack,
        navigationOptions: ({ navigation }) => ({
            header: null,
            title: I18n.t('info'),
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                iconName = `ios-star${focused ? '' : '-outline'}`;
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            }
        })
    },
    Settings: {
        screen: SettingStack,
        navigationOptions: ({ navigation }) => ({
            title: I18n.t('setting'),
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                iconName = `ios-settings${focused ? '' : '-outline'}`;
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
            tabBarVisible: () => {
                console.log(navigation.state);
                return true;
            }
        })
    },
    Chat: {
        screen: ChatScreen,
        navigationOptions: ({ navigation }) => ({
            title: I18n.t('chat'),
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                iconName = `ios-text${focused ? '' : '-outline'}`;
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            }
        })
    }
},
    (Platform.OS === 'android')
        ? {
            tabBarComponent: props => <TabBarComponent {...props} />,
            tabBarPosition: 'bottom'
        }
        : {
            // don't change tabBarComponent here - it works on iOS after all.
        });

const Navigator = createStackNavigator({
    Main: {
        screen: RootStack,
        navigationOptions: () => ({
            header: null
        })
    },
    Camera: {
        screen: CameraScreen,
        navigationOptions: () => ({
            header: null
        })
    },
    PhotoPreview: {
        screen: PhotoPreviewScreen,
        navigationOptions: () => ({
            header: null
        }),
    },
    Video: {
        screen: VideoResponseScreen,
        navigationOptions: () => ({
            header: null
        })
    },
    TextInput: {
        screen: TextInputScreen,
        navigationOptions: () => ({
            header: null
        })
    },
    Select: {
        screen: SelectScreen,
        navigationOptions: () => ({
            header: null
        })
    },
    PhotoAlbum: {
        screen: PhotoAlbumScreen,
        navigationOptions: () => ({
            header: null
        })
    }
});

const AuthNavigator = createStackNavigator(
    {
        Signin: {
            screen: SigninScreen,
            navigationOptions: () => ({
                header: null
            })
        },
        Signup: {
            screen: SignupScreen,
            navigationOptions: () => ({
                header: null
            })
        }
    },
    {
        initialRouteName: 'Signin'
    });
export { Navigator, AuthNavigator };