import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNavigation } from '@react-navigation/native';

const FavoritesScreen = () => {
  const { favorites, removeFromFavorites, loading } = useFavorites();
  const navigation = useNavigation();

  const handleRemoveFavorite = async (recipeId, recipeName) => {
    Alert.alert(
      'Remove Favorite',
      `Remove "${recipeName}" from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFromFavorites(recipeId);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove from favorites. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate('Details', { recipe });
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => handleRecipePress(item)}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.recipeName} numberOfLines={2}>
          {item.strMeal}
        </Text>
        {item.strCategory && (
          <Text style={styles.category}>{item.strCategory}</Text>
        )}
        {item.strArea && (
          <Text style={styles.area}>{item.strArea}</Text>
        )}
        <Text style={styles.dateAdded}>
          Added {new Date(item.dateAdded).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.idMeal, item.strMeal)}
        disabled={loading}
      >
        <Icon name="heart" size={24} color="#ff6347" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="heart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring recipes and tap the heart icon to save your favorites!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'}
        </Text>
      </View>

      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderFavoriteItem}
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  favoriteCard: {
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
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
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
  category: {
    fontSize: 14,
    color: '#ff6347',
    fontWeight: '500',
  },
  area: {
    fontSize: 14,
    color: '#666',
  },
  dateAdded: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  removeButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});

export default FavoritesScreen;