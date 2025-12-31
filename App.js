import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './src/screens/HomeScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { Book, BarChart3 } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
        <Tab.Screen
          name="Accueil"
          component={HomeScreen}
          options={{ tabBarIcon: ({color}) => <Book color={color} size={24} /> }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{ tabBarIcon: ({color}) => <BarChart3 color={color} size={24} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}