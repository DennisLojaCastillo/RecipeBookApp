import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const EditRecipeScreen = ({ route, navigation }) => {
  const { recipe } = route.params;

  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState(recipe.ingredients || []);
  const [steps, setSteps] = useState(recipe.steps || []);
  const [newIngredient, setNewIngredient] = useState("");
  const [newStep, setNewStep] = useState("");
  const [image, setImage] = useState(recipe.imageURL || null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri) => {
    if (!imageUri) return null;

    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `recipe_images/${Date.now()}.jpg`);

    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required.");
      return;
    }

    let imageURL = image;
    if (image && image !== recipe.imageURL) {
      setUploading(true);
      imageURL = await uploadImage(image);
      setUploading(false);
    }

    try {
      const recipeRef = doc(db, "recipes", recipe.id);
      await updateDoc(recipeRef, {
        title,
        description,
        ingredients,
        steps,
        imageURL: imageURL || null,
      });
      alert("Recipe updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating recipe:", error.message);
    }
  };

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
  
              alert("Recipe deleted successfully!");
              
              // Naviger tilbage til RecipesScreen
              navigation.reset({
                index: 0,
                routes: [{ name: "Recipes" }],
              });
            } catch (error) {
              console.error("Error deleting recipe:", error.message);
              alert("Failed to delete recipe.");
            }
          },
        },
      ]
    );
  };
  

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient("");
    }
  };

  const handleAddStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, newStep]);
      setNewStep("");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Recipe</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: "top" }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Change Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <View style={styles.inline}>
        <TextInput
          style={styles.inlineInput}
          placeholder="Add Ingredient"
          value={newIngredient}
          onChangeText={setNewIngredient}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.listItem}>
          • {ingredient}
        </Text>
      ))}
      <Text style={styles.sectionTitle}>Steps</Text>
      <View style={styles.inline}>
        <TextInput
          style={styles.inlineInput}
          placeholder="Add Step"
          value={newStep}
          onChangeText={setNewStep}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddStep}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {steps.map((step, index) => (
        <Text key={index} style={styles.listItem}>
          {index + 1}. {step}
        </Text>
      ))}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? "Uploading..." : "Save"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  imagePicker: {
    marginBottom: 16,
  },
  imagePickerText: {
    color: "#6200ee",
    textDecorationLine: "underline",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 8,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  inlineInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
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
    fontWeight: "bold",
    fontSize: 16,
  },
  listItem: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default EditRecipeScreen;
