import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";

const fallbackImage = require("../assets/fallback.png");

const RecipeDetailScreen = ({ route, navigation }) => {
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

  const handleDelete = async () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const recipeRef = doc(db, "recipes", recipe.id);
              await deleteDoc(recipeRef);

              if (recipe.imageURL) {
                const imageRef = ref(storage, recipe.imageURL);
                await deleteObject(imageRef);
              }

              Alert.alert("Success", "Recipe deleted successfully!");
              navigation.reset({
                index: 0,
                routes: [{ name: "Recipes" }],
              });
            } catch (error) {
              console.error("Error deleting recipe:", error.message);
              Alert.alert("Error", "Failed to delete recipe.");
            }
          },
        },
      ]
    );
  };

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

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Edit your Recipe", { recipe: recipeData })}
      >
        <Text style={styles.buttonText}>Edit Recipe</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Recipe</Text>
      </TouchableOpacity>
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
    paddingLeft: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipeDetailScreen;
