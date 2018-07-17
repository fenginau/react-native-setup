import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import HomeScreen from '../views/home';
import KnowledgeBaseScreen from '../views/knowledgebase';
import SettingScreen from '../views/setting';
import KnowledgebaseItemScreen from '../views/knowledgebaseitem';
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


const Navigator = createBottomTabNavigator({
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
        screen: SettingScreen,
        navigationOptions: ({ navigation }) => ({
            title: I18n.t('setting'),
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                iconName = `ios-settings${focused ? '' : '-outline'}`;
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            }
        })
    }
});
export default Navigator;