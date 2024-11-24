import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import AuthScreen from "./screens/AuthScreen";

// Import screens
import HomeScreen from "./screens/HomeScreen";
import RecipesScreen from "./screens/RecipesScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import EditRecipeScreen from "./screens/EditRecipeScreen";
import CreateRecipeScreen from "./screens/CreateRecipeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";


// Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RecipesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="RecipesList" component={RecipesScreen} /> 
    <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} />
    <Stack.Screen name="EditRecipe" component={EditRecipeScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="UserProfile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Recipes" component={RecipesStack} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
