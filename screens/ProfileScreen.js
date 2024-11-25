import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db, storage, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native"; // Importer useFocusEffect

const fallbackImage = require("../assets/profileFallback.png");

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Funktion til at hente profildata
  const fetchProfile = async () => {
    setLoading(true); // Start loading
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      } else {
        console.log("No profile found for this user.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Brug useFocusEffect til at hente data ved navigation tilbage til skærmen
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setUploading(true);
        const downloadURL = await uploadImage(result.assets[0].uri);
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          profileImage: downloadURL,
        });
        setProfile((prev) => ({ ...prev, profileImage: downloadURL }));
        setUploading(false);
      }
    } catch (error) {
      console.error("Error picking image:", error.message);
      setUploading(false);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            console.log("User logged out");
          } catch (error) {
            console.error("Error during logout:", error.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            profile.profileImage ? { uri: profile.profileImage } : fallbackImage
          }
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
          <Text style={styles.changeImageText}>
            {uploading ? "Uploading..." : "Change Profile Image"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{profile.name || "Not set"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{profile.age || "Not set"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{profile.city || "Not set"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile.email || auth.currentUser.email}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    alignItems: "center",
    marginVertical: 50,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  changeImageButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#6200EE",
    borderRadius: 20,
  },
  changeImageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  detailsContainer: {
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  buttonsContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  editProfileButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    paddingHorizontal: 140,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 15,
    paddingHorizontal: 155,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
});

export default ProfileScreen;
