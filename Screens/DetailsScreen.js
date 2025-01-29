import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { recipe } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Recipe Image (Placeholder for now) */}
      <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />

      {/* Recipe Name */}
      <Text style={styles.title}>{recipe.title}</Text>

      {/* Ingredients (Placeholder) */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <Text>- Ingredient 1</Text>
      <Text>- Ingredient 2</Text>
      <Text>- Ingredient 3</Text>

      {/* Instructions (Placeholder) */}
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
});

export default DetailsScreen;