import React from 'react';
import { FlatList, Text, TouchableOpacity, Image, StyleSheet, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../contexts/FavoritesContext';

const RecommendedSection = ({ recipes, onSelectRecipe, onViewAll }) => {
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const handleFavoritePress = async (item, event) => {
    event.stopPropagation(); // Prevent triggering the recipe selection
    try {
      await toggleFavorite(item);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  };

  const renderRecipe = ({ item, index }) => {
    if (index === 5) {
      // Render the "View More" tile as the 6th item
      return (
        <TouchableOpacity style={styles.viewMoreCard} onPress={onViewAll}>
          <View style={styles.viewMoreContent}>
            <Icon name="grid-outline" size={32} color="#ff6347" />
            <Text style={styles.viewMoreText}>View All</Text>
            <Text style={styles.viewMoreSubtext}>See more recipes</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const isRecipeFavorite = isFavorite(item.idMeal);

    return (
      <TouchableOpacity style={styles.card} onPress={() => onSelectRecipe(item)}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.strMealThumb }} style={styles.image} />
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={(event) => handleFavoritePress(item, event)}
              disabled={loading}
            >
              <Icon
                name={isRecipeFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isRecipeFavorite ? "#ff6347" : "#fff"}
              />
            </TouchableOpacity>
          </View>
          {item.cookingTime && (
            <View style={styles.timeContainer}>
              <Icon name="time-outline" size={12} color="#fff" />
              <Text style={styles.timeText}>{item.cookingTime}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>
            {item.strMeal}
          </Text>
          {item.strCategory && (
            <Text style={styles.category}>{item.strCategory}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Popular Recipes</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>See all</Text>
          <Icon name="chevron-forward" size={16} color="#ff6347" />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={recipes.slice(0, 6)} // Ensure only up to 6 items are processed
        keyExtractor={(item, index) => (item.idMeal ? item.idMeal : `view-more-${index}`)}
        renderItem={renderRecipe}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#ff6347',
    fontWeight: '600',
    marginRight: 4,
  },
  listContainer: {
    paddingLeft: 4,
  },
  card: {
    marginRight: 16,
    width: 160,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: 160,
    height: 200,
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 12,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  timeContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  cardContent: {
    paddingTop: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c2c2c',
    marginBottom: 4,
    lineHeight: 20,
  },
  category: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  viewMoreCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ff6347',
    borderStyle: 'dashed',
  },
  viewMoreContent: {
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6347',
    marginTop: 8,
  },
  viewMoreSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default RecommendedSection;