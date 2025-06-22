import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../contexts/FavoritesContext';

const DetailsScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const { isFavorite, toggleFavorite, loading } = useFavorites();

  const handleFavoritePress = async () => {
    try {
      await toggleFavorite(recipe);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  };

  const isRecipeFavorite = isFavorite(recipe.idMeal);

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button and Favorite */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          disabled={loading}
        >
          <Icon
            name={isRecipeFavorite ? "heart" : "heart-outline"}
            size={28}
            color={isRecipeFavorite ? "#ff6347" : "#333"}
          />
        </TouchableOpacity>
      </View>

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
          <Text key={index} style={styles.ingredient}>
            {item.measure} {item.ingredient}
          </Text>
        ))}

      {/* Instructions */}
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{recipe.strInstructions}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 4,
    marginHorizontal: 16,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    marginHorizontal: 16,
    marginBottom: 20,
  },
});

export default DetailsScreen;