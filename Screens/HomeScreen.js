import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topRecipes, setTopRecipes] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Fetch Top Recipes (Chicken-based)
        const topResponse = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken');
        const topData = await topResponse.json();
        setTopRecipes(topData.meals || []);

        // Fetch Suggested Recipes (Beef-based)
        const suggestedResponse = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=beef');
        const suggestedData = await suggestedResponse.json();
        setSuggestedRecipes(suggestedData.meals || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Renders top recipes (with images and truncated text)
  const renderTopRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.topRecipeCard}
      onPress={() => navigation.navigate('Details', { recipe: item })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.topRecipeImage} />
      <Text style={styles.topRecipeTitle} numberOfLines={1}>
        {item.strMeal}
      </Text>
    </TouchableOpacity>
  );

  // Renders suggested recipes (with distinct clickable tiles)
  const renderSuggestedRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestedRecipeCard}
      onPress={() => navigation.navigate('Details', { recipe: item })}
    >
      <Text style={styles.suggestedRecipeText}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* "Tastify" Title */}
      <Text style={styles.appTitle}>Tastify</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for recipes..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Top Recipes Section */}
      <Text style={styles.sectionTitle}>Top Recipes</Text>
      <FlatList
        horizontal
        data={topRecipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderTopRecipeItem}
        showsHorizontalScrollIndicator={false}
      />

      {/* Suggested Recipes Section */}
      <Text style={styles.sectionTitle}>Suggested Recipes</Text>
      <FlatList
        data={suggestedRecipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderSuggestedRecipeItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  topRecipeCard: {
    alignItems: 'center',
    marginRight: 12,
    width: 120, // Adjust for larger thumbnails
  },
  topRecipeImage: {
    width: 120,
    height: 120, // Ensures 1:1 ratio
    borderRadius: 8,
    marginBottom: 8,
  },
  topRecipeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  suggestedRecipeCard: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestedRecipeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;