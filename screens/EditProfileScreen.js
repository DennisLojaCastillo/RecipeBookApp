import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EditProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Edit Your Profile</Text>
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

export default EditProfileScreen;
