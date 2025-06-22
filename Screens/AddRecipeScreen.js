import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useUserRecipes } from '../contexts/UserRecipesContext';

const AddRecipeScreen = ({ navigation, route }) => {
  const { createRecipe, updateRecipe, loading } = useUserRecipes();
  const isEditing = route?.params?.recipe;
  const existingRecipe = route?.params?.recipe;

  const [recipeName, setRecipeName] = useState(existingRecipe?.name || '');
  const [description, setDescription] = useState(existingRecipe?.description || '');
  const [category, setCategory] = useState(existingRecipe?.category || '');
  const [cookingTime, setCookingTime] = useState(existingRecipe?.cookingTime || '');
  const [servings, setServings] = useState(existingRecipe?.servings || '');
  const [ingredients, setIngredients] = useState(existingRecipe?.ingredients || ['']);
  const [instructions, setInstructions] = useState(existingRecipe?.instructions || '');
  const [imageUri, setImageUri] = useState(existingRecipe?.imageUrl || null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const validateForm = () => {
    if (!recipeName.trim()) {
      Alert.alert('Error', 'Please enter a recipe name');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    if (ingredients.filter(ing => ing.trim()).length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return false;
    }
    if (!instructions.trim()) {
      Alert.alert('Error', 'Please enter cooking instructions');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const recipeData = {
        name: recipeName.trim(),
        description: description.trim(),
        category: category.trim() || 'Other',
        cookingTime: cookingTime.trim(),
        servings: servings.trim(),
        ingredients: ingredients.filter(ing => ing.trim()),
        instructions: instructions.trim(),
        imageUri: imageUri,
      };

      if (isEditing) {
        recipeData.currentImageUrl = existingRecipe.imageUrl;
        await updateRecipe(existingRecipe.id, recipeData);
        Alert.alert('Success', 'Recipe updated successfully!');
      } else {
        await createRecipe(recipeData);
        Alert.alert('Success', 'Recipe created successfully!');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Recipe' : 'Add Recipe'}
        </Text>
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.recipeImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="camera" size={40} color="#ccc" />
              <Text style={styles.imagePickerText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Recipe Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recipe Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipe name"
            value={recipeName}
            onChangeText={setRecipeName}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Brief description of your recipe"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Category and Time Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Dessert"
              value={category}
              onChangeText={setCategory}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Cooking Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30 mins"
              value={cookingTime}
              onChangeText={setCookingTime}
            />
          </View>
        </View>

        {/* Servings */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Servings</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 4 people"
            value={servings}
            onChangeText={setServings}
          />
        </View>

        {/* Ingredients */}
        <View style={styles.inputGroup}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Ingredients *</Text>
            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <Icon name="add" size={20} color="#ff6347" />
            </TouchableOpacity>
          </View>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <TextInput
                style={[styles.input, styles.ingredientInput]}
                placeholder={`Ingredient ${index + 1}`}
                value={ingredient}
                onChangeText={(value) => updateIngredient(index, value)}
              />
              {ingredients.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeIngredient(index)}
                >
                  <Icon name="remove" size={20} color="#ff6347" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instructions *</Text>
          <TextInput
            style={[styles.input, styles.instructionsArea]}
            placeholder="Step-by-step cooking instructions..."
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={6}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveButton: {
    backgroundColor: '#ff6347',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imagePicker: {
    marginBottom: 20,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 16,
    color: '#ccc',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    padding: 4,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
  },
  instructionsArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  bottomPadding: {
    height: 50,
  },
});

export default AddRecipeScreen;
