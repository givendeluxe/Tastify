import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from './AuthContext';

const UserRecipesContext = createContext({});

export const useUserRecipes = () => {
  const context = useContext(UserRecipesContext);
  if (!context) {
    throw new Error('useUserRecipes must be used within a UserRecipesProvider');
  }
  return context;
};

export const UserRecipesProvider = ({ children }) => {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Listen to user's recipes in real-time
  useEffect(() => {
    if (!user) {
      setUserRecipes([]);
      return;
    }

    const recipesQuery = query(
      collection(db, 'userRecipes'),
      where('userId', '==', user.uid)
    );
    
    const unsubscribe = onSnapshot(recipesQuery, (snapshot) => {
      const recipes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by createdAt in descending order (newest first)
      recipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserRecipes(recipes);
    }, (error) => {
      console.error('Error listening to user recipes:', error);
    });

    return unsubscribe;
  }, [user]);

  // Upload image to Firebase Storage
  const uploadImage = async (imageUri, recipeId) => {
    if (!imageUri || !user) return null;

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const imageRef = ref(storage, `recipes/${user.uid}/${recipeId}_${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Create new recipe
  const createRecipe = async (recipeData) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      // Create recipe document first to get ID
      const recipeRef = await addDoc(collection(db, 'userRecipes'), {
        ...recipeData,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl: '', // Will be updated after image upload
      });

      // Upload image if provided
      let imageUrl = '';
      if (recipeData.imageUri) {
        imageUrl = await uploadImage(recipeData.imageUri, recipeRef.id);
        
        // Update recipe with image URL
        await updateDoc(recipeRef, {
          imageUrl: imageUrl
        });
      }

      console.log('Recipe created successfully:', recipeRef.id);
      return recipeRef.id;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update existing recipe
  const updateRecipe = async (recipeId, recipeData) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      const recipeRef = doc(db, 'userRecipes', recipeId);
      
      let updateData = {
        ...recipeData,
        updatedAt: new Date().toISOString(),
      };

      // Upload new image if provided
      if (recipeData.imageUri && recipeData.imageUri !== recipeData.currentImageUrl) {
        const imageUrl = await uploadImage(recipeData.imageUri, recipeId);
        updateData.imageUrl = imageUrl;
      }

      // Remove imageUri from update data as it's not needed in Firestore
      delete updateData.imageUri;
      delete updateData.currentImageUrl;

      await updateDoc(recipeRef, updateData);
      console.log('Recipe updated successfully:', recipeId);
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete recipe
  const deleteRecipe = async (recipeId, imageUrl) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      // Delete image from storage if exists
      if (imageUrl) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (imageError) {
          console.warn('Error deleting image:', imageError);
          // Continue with recipe deletion even if image deletion fails
        }
      }

      // Delete recipe document
      await deleteDoc(doc(db, 'userRecipes', recipeId));
      console.log('Recipe deleted successfully:', recipeId);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get recipe by ID
  const getRecipeById = (recipeId) => {
    return userRecipes.find(recipe => recipe.id === recipeId);
  };

  const value = {
    userRecipes,
    loading,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
  };

  return (
    <UserRecipesContext.Provider value={value}>
      {children}
    </UserRecipesContext.Provider>
  );
};
