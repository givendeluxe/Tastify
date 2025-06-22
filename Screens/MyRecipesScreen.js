import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserRecipes } from '../contexts/UserRecipesContext';
import { useNavigation } from '@react-navigation/native';

const MyRecipesScreen = () => {
  const { userRecipes, deleteRecipe, loading } = useUserRecipes();
  const navigation = useNavigation();

  const handleEditRecipe = (recipe) => {
    navigation.navigate('AddRecipe', { recipe });
  };

  const handleDeleteRecipe = (recipe) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipe.id, recipe.imageUrl);
              Alert.alert('Success', 'Recipe deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete recipe. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleViewRecipe = (recipe) => {
    // Convert user recipe to the format expected by DetailsScreen
    const formattedRecipe = {
      idMeal: recipe.id,
      strMeal: recipe.name,
      strMealThumb: recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image',
      strInstructions: recipe.instructions,
      strCategory: recipe.category || 'User Recipe',
      strArea: 'User Created',
      // Convert ingredients array to the format expected by DetailsScreen
      ...recipe.ingredients.reduce((acc, ingredient, index) => {
        acc[`strIngredient${index + 1}`] = ingredient;
        acc[`strMeasure${index + 1}`] = '';
        return acc;
      }, {}),
    };

    navigation.navigate('Details', { recipe: formattedRecipe });
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => handleViewRecipe(item)}
    >
      <Image 
        source={{ 
          uri: item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image' 
        }} 
        style={styles.recipeImage} 
      />
      <View style={styles.recipeContent}>
        <Text style={styles.recipeName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.recipeInfo}>
          {item.category && (
            <Text style={styles.category}>{item.category}</Text>
          )}
          {item.cookingTime && (
            <Text style={styles.cookingTime}>⏱ {item.cookingTime}</Text>
          )}
        </View>
        <Text style={styles.dateCreated}>
          Created {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditRecipe(item)}
          disabled={loading}
        >
          <Icon name="pencil" size={20} color="#ff6347" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteRecipe(item)}
          disabled={loading}
        >
          <Icon name="trash" size={20} color="#ff6347" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="restaurant-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Recipes Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start creating your own recipes and share them with the world!
      </Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate('AddRecipe')}
      >
        <Icon name="add" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Recipes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddRecipe')}
        >
          <Icon name="add" size={24} color="#ff6347" />
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.recipeCount}>
          {userRecipes.length} {userRecipes.length === 1 ? 'recipe' : 'recipes'}
        </Text>
      </View>

      {userRecipes.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={userRecipes}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  subHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  recipeCount: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  recipeImage: {
    width: 100,
    height: 120,
  },
  recipeContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recipeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#ff6347',
    fontWeight: '500',
    marginRight: 12,
  },
  cookingTime: {
    fontSize: 12,
    color: '#666',
  },
  dateCreated: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  actionButton: {
    padding: 8,
    marginVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6347',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default MyRecipesScreen;
