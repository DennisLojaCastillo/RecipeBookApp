import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const RecipeDetailScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Recipe Details</Text>
      <Button title="Edit Recipe" onPress={() => navigation.navigate("EditRecipe")} />
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

export default RecipeDetailScreen;
