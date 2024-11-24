import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CreateRecipeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Create a New Recipe</Text>
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

export default CreateRecipeScreen;
