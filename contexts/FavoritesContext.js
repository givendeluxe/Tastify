import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext({});

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Listen to user's favorites in real-time
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setFavorites(userData.favorites || []);
      }
    }, (error) => {
      console.error('Error listening to favorites:', error);
    });

    return unsubscribe;
  }, [user]);

  // Add recipe to favorites
  const addToFavorites = async (recipe) => {
    if (!user) return;

    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // Create a simplified recipe object for storage
      const favoriteRecipe = {
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
        strCategory: recipe.strCategory || '',
        strArea: recipe.strArea || '',
        dateAdded: new Date().toISOString(),
      };

      await updateDoc(userDocRef, {
        favorites: arrayUnion(favoriteRecipe)
      });

      console.log('Recipe added to favorites:', recipe.strMeal);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove recipe from favorites
  const removeFromFavorites = async (recipeId) => {
    if (!user) return;

    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // Find the recipe to remove
      const recipeToRemove = favorites.find(fav => fav.idMeal === recipeId);
      
      if (recipeToRemove) {
        await updateDoc(userDocRef, {
          favorites: arrayRemove(recipeToRemove)
        });
        console.log('Recipe removed from favorites:', recipeToRemove.strMeal);
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if recipe is in favorites
  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.idMeal === recipeId);
  };

  // Toggle favorite status
  const toggleFavorite = async (recipe) => {
    if (isFavorite(recipe.idMeal)) {
      await removeFromFavorites(recipe.idMeal);
    } else {
      await addToFavorites(recipe);
    }
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
