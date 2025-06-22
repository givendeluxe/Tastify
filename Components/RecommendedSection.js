import React from 'react';
import { FlatList, Text, TouchableOpacity, Image, StyleSheet, View } from 'react-native';

const RecommendedSection = ({ recipes, onSelectRecipe, onViewAll }) => {
  const renderRecipe = ({ item, index }) => {
    if (index === 5) {
      // Render the "View More" tile as the 6th item
      return (
        <TouchableOpacity style={styles.viewMoreCard} onPress={onViewAll}>
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.card} onPress={() => onSelectRecipe(item)}>
        <Image source={{ uri: item.strMealThumb }} style={styles.image} />
        <Text style={styles.title} numberOfLines={1}>
          {item.strMeal}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recommended</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={recipes.slice(0, 6)} // Ensure only up to 6 items are processed
        keyExtractor={(item, index) => (item.idMeal ? item.idMeal : `view-more-${index}`)}
        renderItem={renderRecipe}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    color: '#aaa',
    textDecorationLine: 'underline',
  },
  card: {
    marginRight: 12,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  viewMoreCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 160,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'tomato',
  },
});

export default RecommendedSection;