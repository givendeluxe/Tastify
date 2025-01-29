import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { recipe } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Recipe Image */}
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />

      {/* Recipe Name */}
      <Text style={styles.title}>{recipe.strMeal}</Text>

      {/* Ingredients */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {Array.from({ length: 20 }, (_, i) => i + 1)
        .map((num) => ({
          ingredient: recipe[`strIngredient${num}`],
          measure: recipe[`strMeasure${num}`],
        }))
        .filter((item) => item.ingredient)
        .map((item, index) => (
          <Text key={index}>
            {item.measure} {item.ingredient}
          </Text>
        ))}

      {/* Instructions */}
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text>{recipe.strInstructions}</Text>
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