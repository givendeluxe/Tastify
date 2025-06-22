import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBar from '../Components/SearchBar';
import RecommendedSection from '../Components/RecommendedSection';
import FoodTypesSection from '../Components/FoodTypesSection';
import RecipeAPI from '../services/RecipeAPI';

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
      const data = await RecipeAPI.getRandomRecipes(6);
      setTopRecipes(data.meals || []);
    } catch (err) {
      console.error('Error fetching top recipes:', err);
      setError('Failed to load recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await RecipeAPI.searchRecipes(searchTerm);
      setTopRecipes(data.meals || []);
    } catch (err) {
      console.error('Error searching recipes:', err);
      setError('No recipes found. Please try a different search term.');
    } finally {
      setLoading(false);
    }
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.subtitle}>What would you like to cook today?</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person-circle" size={32} color="#ff6347" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSubmitSearch={handleSearch}
        />

        {/* Recommended Section */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6347" />
            <Text style={styles.loadingText}>Finding delicious recipes...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Icon name="sad-outline" size={48} color="#ccc" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchTopRecipes}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <RecommendedSection
            recipes={topRecipes}
            onSelectRecipe={(recipe) => navigation.navigate('Details', { recipe })}
            onViewAll={handleViewAll}
          />
        )}

        {/* Food Type Tabs Section */}
        <FoodTypesSection navigation={navigation} />

        {/* Bottom Padding for FAB */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddRecipe')}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  profileButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#ff6347',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomPadding: {
    height: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default HomeScreen;