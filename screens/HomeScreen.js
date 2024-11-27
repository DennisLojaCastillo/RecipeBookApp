import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const fallbackImage = require("../assets/fallback.png");

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Fetch all recipes from Firestore
  const fetchRecipes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const fetchedRecipes = [];
      querySnapshot.forEach((doc) => {
        fetchedRecipes.push({ id: doc.id, ...doc.data() });
      });
      setRecipes(fetchedRecipes);
      setFilteredRecipes(fetchedRecipes); // Initial filtering
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
    }
  };

  // Use useFocusEffect to fetch recipes when screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

  // Filter recipes based on search text
  const handleSearch = (text) => {
    setSearchText(text);
    if (text === "") {
      setFilteredRecipes(recipes); // Show all if search text is empty
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  const renderRecipe = ({ item }) => {
    const imageSource = item.imageURL ? { uri: item.imageURL } : fallbackImage;
  
    return (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() =>
          navigation.navigate("Recipes", {
            screen: "Recipe View", // Gå til Recipe View i RecipesStack
            params: { recipe: item }, // Send opskriftsdata
          })
        }
      >
        <Image source={imageSource} style={styles.recipeImage} />
        <View style={styles.textContainer}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <Text style={styles.recipeCreatedBy}>
            Created By: {item.createdByName || "Anonymous"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Home</Text>
        </View>

        {/* Search and Recipes */}
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search recipes..."
            value={searchText}
            onChangeText={handleSearch}
          />
          <FlatList
            data={filteredRecipes}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipe}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No recipes found.</Text>
            }
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: StatusBar.currentHeight || 67, // Padding for status bar
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  list: {
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
  },
  textContainer: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  recipeCreatedBy: {
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
});

export default HomeScreen;
