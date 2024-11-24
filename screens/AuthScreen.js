import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { auth, db } from "../firebase"; // Firebase-konfiguration
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        // Registrer ny bruger
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("User registered:", user);

        // Forsøg at gemme brugeroplysninger i Firestore
        try {
          await setDoc(doc(db, "users", user.uid), {
            name,
            age,
            city,
            email: user.email,
          });
          console.log("User data saved to Firestore");
        } catch (firestoreError) {
          console.error("Firestore Error:", firestoreError.message);
        }
      } else {
        // Log eksisterende bruger ind
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("User logged in:", user);
      }

      setError(""); // Ryd fejlmeddelelser
      console.log("Navigating to Main");
      navigation.navigate("Main"); // Naviger til MainTabs
    } catch (authError) {
      console.error("Auth Error:", authError.message);
      setError(authError.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <Text style={styles.title}>RecipeBook</Text>

        {/* Registreringsfelter vises kun for nye brugere */}
        {isSignUp && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
          </>
        )}

        {/* Fælles felter for login og registrering */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Fejlmeddelelse */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Login/Registreringsknap */}
        <Button title={isSignUp ? "Sign Up" : "Login"} onPress={handleAuth} />

        {/* Skift mellem login og registrering */}
        <Text style={styles.switchText} onPress={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </Text>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  switchText: {
    marginTop: 20,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default AuthScreen;
