import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RecipeAPI from '../services/RecipeAPI';

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
      const data = await RecipeAPI.getRecipesByCategory(type);
      setRecipes(data.meals || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setRecipes([]);
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
      onPress={() => navigation.navigate('Details', { recipe: item })}
    >
      <View style={styles.recipeImageContainer}>
        <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
        {item.cookingTime && (
          <View style={styles.timeContainer}>
            <Icon name="time-outline" size={12} color="#fff" />
            <Text style={styles.timeText}>{item.cookingTime}</Text>
          </View>
        )}
      </View>
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle} numberOfLines={2}>{item.strMeal}</Text>
        {item.strCategory && (
          <Text style={styles.recipeCategory}>{item.strCategory}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>

      {/* Food Type Tabs */}
      <FlatList
        horizontal
        data={foodTypes}
        keyExtractor={(item) => item}
        renderItem={renderTab}
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      />

      {/* Recipes Section */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6347" />
          <Text style={styles.loadingText}>Loading {selectedType} recipes...</Text>
        </View>
      ) : recipes.length > 0 ? (
        <FlatList
          horizontal
          data={recipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderRecipe}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recipesContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="restaurant-outline" size={48} color="#ccc" />
          <Text style={styles.noDataText}>No {selectedType} recipes found</Text>
          <Text style={styles.noDataSubtext}>Try selecting a different category</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tabsContent: {
    paddingLeft: 4,
  },
  tab: {
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedTab: {
    backgroundColor: '#ff6347',
    borderColor: '#ff6347',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  recipesContainer: {
    paddingLeft: 4,
  },
  recipeCard: {
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    width: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeImageContainer: {
    position: 'relative',
  },
  recipeImage: {
    width: 140,
    height: 120,
  },
  timeContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 3,
  },
  recipeContent: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c2c2c',
    marginBottom: 4,
    lineHeight: 18,
  },
  recipeCategory: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontWeight: '500',
  },
  noDataSubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default FoodTypesSection;