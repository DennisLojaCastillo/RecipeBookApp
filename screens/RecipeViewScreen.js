import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const fallbackImage = require("../assets/fallback.png");

const RecipeViewScreen = ({ route }) => {
  const { recipe } = route.params;
  const [recipeData, setRecipeData] = useState(recipe);
  const [loading, setLoading] = useState(false);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const recipeDoc = await getDoc(doc(db, "recipes", recipe.id));
      if (recipeDoc.exists()) {
        setRecipeData({ id: recipe.id, ...recipeDoc.data() });
      } else {
        console.error("Recipe not found.");
      }
    } catch (error) {
      console.error("Error fetching recipe:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipe();
    }, [])
  );

  const imageSource = recipeData.imageURL
    ? { uri: recipeData.imageURL }
    : fallbackImage;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={imageSource} style={styles.recipeImage} />
      <Text style={styles.title}>{recipeData.title}</Text>
      <Text style={styles.description}>{recipeData.description}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipeData.ingredients && recipeData.ingredients.length > 0 ? (
        recipeData.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.listItem}>
            • {ingredient}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyText}>No ingredients listed.</Text>
      )}

      <Text style={styles.sectionTitle}>Steps</Text>
      {recipeData.steps && recipeData.steps.length > 0 ? (
        recipeData.steps.map((step, index) => (
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
    marginVertical: 7,
    paddingLeft: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipeViewScreen;
