import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { db, auth } from "../firebase"; // Tilføjet auth for at få den nuværende bruger
import { collection, getDocs, query, where } from "firebase/firestore"; // Tilføjet query og where
import { FAB } from "react-native-paper"; // Floating Action Button
import { useFocusEffect } from "@react-navigation/native"; // For at opdatere ved navigering

const fallbackImage = require("../assets/fallback.png");

const RecipesScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);

  // Hent opskrifter fra Firestore for den nuværende bruger
  const fetchRecipes = async () => {
    try {
      const userEmail = auth.currentUser?.email; // Hent brugerens email
      if (!userEmail) {
        console.error("User is not logged in.");
        return;
      }

      // Query for kun at hente brugerens opskrifter
      const q = query(
        collection(db, "recipes"),
        where("createdBy", "==", userEmail)
      );

      const querySnapshot = await getDocs(q);
      const fetchedRecipes = [];
      querySnapshot.forEach((doc) => {
        fetchedRecipes.push({ id: doc.id, ...doc.data() });
      });

      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
    }
  };

  // Opdater ved navigering til skærmen
  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const renderRecipe = ({ item }) => {
    const imageSource = item.imageURL ? { uri: item.imageURL } : fallbackImage;

    return (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => navigation.navigate("Recipe Details", { recipe: item })}
      >
        <Image source={imageSource} style={styles.recipeImage} />
        <View style={styles.textContainer}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <Text style={styles.recipeDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipe}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recipes found.</Text>
        }
      />
      <FAB
        style={styles.fab}
        icon="plus"
        label="Create"
        onPress={() => navigation.navigate("Create a Recipe")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },

  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  list: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  textContainer: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#73EC8B",
  },
});

export default RecipesScreen;
