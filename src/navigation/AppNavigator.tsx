import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Book, BarChart3, PlusCircle } from 'lucide-react-native';

// Import de tes écrans
import { HomeScreen } from '../screens/HomeScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { AddBookScreen } from '../screens/AddBookScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

// Stack pour l'onglet Accueil (permet d'aller de Home vers AddBook)
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="AddBook"
        component={AddBookScreen}
        options={{
          headerShown: true,
          title: "Ajouter un livre",
          headerBackTitle: "Retour"
        }}
      />
    </HomeStack.Navigator>
  );
}

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Bibliothèque"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Book color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Statistiques"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};