import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../views/home';
import KnowledgeBaseScreen from '../views/knowledgebase';
import SettingScreen from '../views/setting';
import KnowledgebaseItemScreen from '../views/knowledgebaseitem';

const App = createStackNavigator(
    {
        Home: { screen: HomeScreen },
        Knowledge: { screen: KnowledgeBaseScreen },
        Settings: { screen: SettingScreen },
        KnowledgeItem: { screen: KnowledgebaseItemScreen },
    },
    {
        initialRouteName: 'Home',
    });

export default App;