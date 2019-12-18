import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import AddScreen from '../screens/AddScreen';
import ViewScreen from '../screens/ViewScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ItemsScreen from '../screens/ItemsScreens'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: AddScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Add',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-add-circle${focused ? '' : '-outline'}`
          : 'md-add-circle'
      }
    />
  ),
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: ViewScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'View',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-pie' : 'md-pie'} />
  ),
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: CategoryScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Categories',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-pricetag' : 'md-pricetag'} />
  ),
};

SettingsStack.path = '';

const ItemsStack = createStackNavigator(
  {
    Settings: ItemsScreen,
  },
  config
);

//tabs
const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});

//tabs + other screens
const AppNavigator = createStackNavigator({
  Home: tabNavigator,
  Items: ItemsStack
});

tabNavigator.path = '';

export default createAppContainer(AppNavigator);
