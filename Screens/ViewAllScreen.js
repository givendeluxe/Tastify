import React from 'react';
import { FlatList, Text, TouchableOpacity, Image, StyleSheet, View } from 'react-native';

const ViewAllScreen = ({ route, navigation }) => {
    const { recipes } = route.params; // These are simplified recipes with idMeal, strMeal, and strMealThumb only
  
    const renderRecipe = ({ item }) => (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Details', { recipe: item })}>
        <Image source={{ uri: item.strMealThumb }} style={styles.image} />
        <Text style={styles.title} numberOfLines={1}>
          {item.strMeal}
        </Text>
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.container}>
        <Text style={styles.header}>All Recommended Recipes</Text>
        <FlatList
          data={recipes.slice(0, 12)} // Limit to 12 items
          keyExtractor={(item) => item.idMeal}
          renderItem={renderRecipe}
          numColumns={2} // Display in a grid layout
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ViewAllScreen;