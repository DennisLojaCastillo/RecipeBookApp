import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const RecipesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Recipes List</Text>
      <Button title="Go to Recipe Detail" onPress={() => navigation.navigate("RecipeDetail")} />
      <Button title="Create New Recipe" onPress={() => navigation.navigate("CreateRecipe")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipesScreen;
