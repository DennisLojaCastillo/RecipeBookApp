import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

const fallbackImage = require("../assets/fallback.png");

const RecipeViewScreen = ({ route }) => {
  const { recipe } = route.params;

  const imageSource = recipe.imageURL ? { uri: recipe.imageURL } : fallbackImage;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={imageSource} style={styles.recipeImage} />
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description}>{recipe.description}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients && recipe.ingredients.length > 0 ? (
        recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.listItem}>
            • {ingredient}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyText}>No ingredients listed.</Text>
      )}

      <Text style={styles.sectionTitle}>Steps</Text>
      {recipe.steps && recipe.steps.length > 0 ? (
        recipe.steps.map((step, index) => (
          <Text key={index} style={styles.listItem}>
            {index + 1}. {step}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyText}>No steps listed.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    marginVertical: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 8,
  },
});

export default RecipeViewScreen;
