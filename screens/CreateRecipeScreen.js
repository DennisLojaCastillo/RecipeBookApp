import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase";

const CreateRecipeScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newStep, setNewStep] = useState("");
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error.message);
    }
  };

  const uploadImage = async (imageUri) => {
    if (!imageUri) {
      console.error("No image URI provided");
      return null;
    }

    try {
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error("Failed to fetch the image file");
      }

      const blob = await response.blob();
      const storageRef = ref(storage, `recipe_images/${Date.now()}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }
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

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill out all required fields!");
      return;
    }

    let imageURL = null;
    if (image) {
      setUploading(true);
      imageURL = await uploadImage(image);
      setUploading(false);
    }

    try {
      // Hent brugerens navn fra 'users'-samlingen
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userName = userDoc.exists() ? userDoc.data().name : "Anonymous";

      // Tilføj opskrift med brugerens email og navn
      await addDoc(collection(db, "recipes"), {
        title,
        description,
        ingredients,
        steps,
        imageURL: imageURL || null,
        createdBy: auth.currentUser.email, // Gem brugerens email
        createdByName: userName, // Gem brugerens navn
        createdAt: new Date(),
      });

      alert("Recipe saved successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving recipe:", error.message);
      alert("Failed to save recipe.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Create a New Recipe</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={2}
          />
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick Image</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
          <Text style={styles.subTitle}>Ingredients</Text>
          <View style={styles.inline}>
            <TextInput
              style={styles.inlineInput}
              placeholder="Add ingredient"
              value={newIngredient}
              onChangeText={setNewIngredient}
            />
            <TouchableOpacity style={styles.buttonSmall} onPress={handleAddIngredient}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listItem}>{ingredient}</Text>
            </View>
          ))}
          <Text style={styles.subTitle}>Steps</Text>
          <View style={styles.inline}>
            <TextInput
              style={styles.inlineInput}
              placeholder="Add step"
              value={newStep}
              onChangeText={setNewStep}
            />
            <TouchableOpacity style={styles.buttonSmall} onPress={handleAddStep}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {steps.map((step, index) => (
            <Text key={index} style={styles.listItem}>
              {index + 1}. {step}
            </Text>
          ))}
          <TouchableOpacity
            style={[styles.button, uploading && styles.disabledButton]}
            onPress={handleSave}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>
              {uploading ? "Uploading..." : "Save Recipe"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  bulletPoint: {
    fontSize: 18,
    marginRight: 8,
    color: "#6200ee",
  },
  listItem: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
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
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonSmall: {
    backgroundColor: "#6200ee",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
});

export default CreateRecipeScreen;
