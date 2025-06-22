import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';

const FoodTypesSection = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState('Italian'); // Default selected category
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const foodTypes = ['Italian', 'Asian', 'Vegetarian', 'Indian', 'Mexican']; // Food categories

  useEffect(() => {
    fetchRecipesByType(selectedType); // Load recipes for the first category on startup
  }, []);

  const fetchRecipesByType = async (type) => {
    setLoading(true);
    setSelectedType(type);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${type}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTab = ({ item }) => (
    <TouchableOpacity
      style={[styles.tab, selectedType === item && styles.selectedTab]}
      onPress={() => fetchRecipesByType(item)}
    >
      <Text style={[styles.tabText, selectedType === item && styles.selectedTabText]}>{item}</Text>
    </TouchableOpacity>
  );

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('Details', { recipe: item })} // Navigate on click
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle} numberOfLines={1}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Food Type Tabs */}
      <FlatList
        horizontal
        data={foodTypes}
        keyExtractor={(item) => item}
        renderItem={renderTab}
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      />

      {/* Recipes Section */}
      {loading ? (
        <ActivityIndicator size="large" color="tomato" style={styles.loader} />
      ) : recipes.length > 0 ? (
        <FlatList
          horizontal
          data={recipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderRecipe}
          contentContainerStyle={styles.recipesContainer}
        />
      ) : (
        <Text style={styles.noDataText}>No recipes found for {selectedType}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tab: {
    backgroundColor: '#f3f3f3',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  selectedTab: {
    backgroundColor: 'tomato',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
  },
  selectedTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 16,
  },
  recipesContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  recipeCard: {
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    width: 150, // Adjusted width for 3:4 ratio
    height: 200, // Adjusted height for 3:4 ratio
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: '75%', // Maintain aspect ratio
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 5,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 16,
  },
});

export default FoodTypesSection;