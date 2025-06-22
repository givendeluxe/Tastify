import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Logo from '../Components/Logo';
import SearchBar from '../Components/SearchBar';
import RecommendedSection from '../Components/RecommendedSection';
import FoodTypesSection from '../Components/FoodTypesSection'; // Import FoodTypesSection

const HomeScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topRecipes, setTopRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTopRecipes();
  }, []);

  const fetchTopRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken'
      );
      const data = await response.json();
      setTopRecipes(data.meals || []);
    } catch (err) {
      console.error('Error fetching top recipes:', err);
      setError('Failed to load recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    console.log('Search Term:', searchTerm);
  };

  const handleViewAll = () => {
    const simplifiedRecipes = topRecipes.map(({ idMeal, strMeal, strMealThumb }) => ({
      idMeal,
      strMeal,
      strMealThumb,
    }));

    navigation.navigate('ViewAll', { recipes: simplifiedRecipes });
  };

  return (
    <View style={styles.container}>
      <Logo />
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSubmitSearch={handleSearch}
      />
      {/* Recommended Section */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <RecommendedSection
          recipes={topRecipes}
          onSelectRecipe={(recipe) => navigation.navigate('Details', { recipe })}
          onViewAll={handleViewAll}
        />
      )}
      
      {/* Food Type Tabs Section (Pass Navigation Prop) */}
      <FoodTypesSection navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
});

export default HomeScreen;