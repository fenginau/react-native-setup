import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import HomeScreen from '../views/home';
import KnowledgeBaseScreen from '../views/knowledgebase';
import KnowledgebaseItemScreen from '../views/knowledgebaseitem';
import SettingScreen from '../views/setting';
import CameraScreen from '../views/camera';
import PhotoPreviewScreen from '../views/photopreview';
import ChatScreen from '../views/chat';
import I18n from '../js/i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
        },
        // Camera: {
        //     screen: CameraScreen,
        //     navigationOptions: () => ({
        //         header: null
        //     })
        // },
        // PhotoPreview: {
        //     screen: PhotoPreviewScreen,
        //     navigationOptions: () => ({
        //         header: null
        //     }),
        // },
    },
    {
        initialRouteName: 'Settings'
    });

const RootStack = createBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            title: I18n.t('home'),
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                iconName = `ios-home${focused ? '' : '-outline'}`;
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
                iconName = `ios-information-circle${focused ? '' : '-outline'}`;
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
    }
});
export default Navigator;