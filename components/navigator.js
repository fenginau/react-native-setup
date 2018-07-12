import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import HomeScreen from '../views/home';
import KnowledgeBaseScreen from '../views/knowledgebase';
import SettingScreen from '../views/setting';
import I18n from '../js/i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Navigator = createBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            title: I18n.t('home'),
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                iconName = `ios-home${focused ? '' : '-outline'}`;

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            }
        })
    },
    Knowledge: {
        screen: KnowledgeBaseScreen,
        navigationOptions: ({ navigation }) => ({
            title: I18n.t('info'),
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                iconName = `ios-information-circle${focused ? '' : '-outline'}`;

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
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

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            }
        })
    }
});
export default Navigator;