import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Ionicons from "react-native-vector-icons/Ionicons"; // Tilføjet til ikoner

// Import screens
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import RecipesScreen from "./screens/RecipesScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import EditRecipeScreen from "./screens/EditRecipeScreen";
import CreateRecipeScreen from "./screens/CreateRecipeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import RecipeViewScreen from "./screens/RecipeViewScreen";

// Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Opsætning af RecipesStack
const RecipesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Your Recipes" component={RecipesScreen} />
    <Stack.Screen name="Recipe View" component={RecipeViewScreen} />
    <Stack.Screen name="Recipe Details" component={RecipeDetailScreen} />
    <Stack.Screen name="Create a Recipe" component={CreateRecipeScreen} />
    <Stack.Screen name="Edit your Recipe" component={EditRecipeScreen} />
  </Stack.Navigator>
);

// Opsætning af ProfileStack
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="UserProfile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Lyt til autentificeringsstatus
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe; // Stop lytteren ved unmount
  }, [initializing]);

  // Vis loading-indikator, mens status bestemmes
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main">
            {() => (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                      iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Recipes") {
                      iconName = focused ? "book" : "book-outline";
                    } else if (route.name === "Profile") {
                      iconName = focused ? "person" : "person-outline";
                    }

                    // Return the icon
                    return <Ionicons name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: "#6200EE",
                  tabBarInactiveTintColor: "gray",
                  headerShown: false,
                })}
              >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen
                  name="Recipes"
                  component={RecipesStack}
                  options={{ headerShown: false }}
                />
                <Tab.Screen
                  name="Profile"
                  component={ProfileStack}
                  options={{ headerShown: false }}
                />
              </Tab.Navigator>
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Stilarter
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
});
