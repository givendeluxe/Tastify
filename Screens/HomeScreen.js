import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const topRecipes = [
    { id: '1', title: 'Spaghetti Bolognese' },
    { id: '2', title: 'Chicken Curry' },
    { id: '3', title: 'Beef Stroganoff' },
  ];

  const suggestedRecipes = [
    { id: '4', title: 'Vegetable Stir Fry' },
    { id: '5', title: 'Margarita Pizza' },
    { id: '6', title: 'Grilled Salmon' },
  ];

  return (
    <View style={styles.container}>
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={styles.recipeCard}
            onPress={() => navigation.navigate('Details', { recipe: item })}
          >
            {item.title}
          </Text>
        )}
      />

      {/* Suggested Recipes Section */}
      <Text style={styles.sectionTitle}>Suggested Recipes</Text>
      <FlatList
        data={suggestedRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={styles.recipeCard}
            onPress={() => navigation.navigate('Details', { recipe: item })}
          >
            {item.title}
          </Text>
        )}
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
  recipeCard: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    marginRight: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;