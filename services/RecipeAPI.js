// Recipe API Service - Provides reliable recipe data
// This service includes mock data as fallback when external APIs are unavailable

const MOCK_RECIPES = [
  {
    idMeal: "1",
    strMeal: "Spaghetti Carbonara",
    strMealThumb: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
    strCategory: "Italian",
    strArea: "Italian",
    strInstructions: "Cook spaghetti according to package directions. In a large bowl, whisk together eggs, cheese, and pepper. Drain pasta and immediately add to egg mixture, tossing quickly to coat. Add pancetta and toss again. Serve immediately.",
    strIngredient1: "Spaghetti",
    strMeasure1: "400g",
    strIngredient2: "Eggs",
    strMeasure2: "4 large",
    strIngredient3: "Parmesan cheese",
    strMeasure3: "100g grated",
    strIngredient4: "Pancetta",
    strMeasure4: "150g diced",
    strIngredient5: "Black pepper",
    strMeasure5: "To taste",
    cookingTime: "20 mins",
    difficulty: "Medium"
  },
  {
    idMeal: "2",
    strMeal: "Chicken Tikka Masala",
    strMealThumb: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    strCategory: "Indian",
    strArea: "Indian",
    strInstructions: "Marinate chicken in yogurt and spices. Grill until cooked. In a pan, sauté onions, add tomatoes, cream, and spices. Add grilled chicken and simmer. Serve with rice or naan.",
    strIngredient1: "Chicken breast",
    strMeasure1: "500g cubed",
    strIngredient2: "Yogurt",
    strMeasure2: "200ml",
    strIngredient3: "Tomatoes",
    strMeasure3: "400g canned",
    strIngredient4: "Heavy cream",
    strMeasure4: "200ml",
    strIngredient5: "Garam masala",
    strMeasure5: "2 tsp",
    cookingTime: "45 mins",
    difficulty: "Medium"
  },
  {
    idMeal: "3",
    strMeal: "Beef Tacos",
    strMealThumb: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    strCategory: "Mexican",
    strArea: "Mexican",
    strInstructions: "Season and cook ground beef with onions and spices. Warm tortillas. Fill with beef, lettuce, cheese, and salsa. Serve with lime wedges.",
    strIngredient1: "Ground beef",
    strMeasure1: "500g",
    strIngredient2: "Taco shells",
    strMeasure2: "8 pieces",
    strIngredient3: "Lettuce",
    strMeasure3: "1 head shredded",
    strIngredient4: "Cheddar cheese",
    strMeasure4: "200g grated",
    strIngredient5: "Salsa",
    strMeasure5: "200ml",
    cookingTime: "25 mins",
    difficulty: "Easy"
  },
  {
    idMeal: "4",
    strMeal: "Pad Thai",
    strMealThumb: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&fit=crop",
    strCategory: "Asian",
    strArea: "Thai",
    strInstructions: "Soak rice noodles. Stir-fry shrimp, add noodles, sauce, eggs, and vegetables. Garnish with peanuts and lime.",
    strIngredient1: "Rice noodles",
    strMeasure1: "200g",
    strIngredient2: "Shrimp",
    strMeasure2: "300g",
    strIngredient3: "Bean sprouts",
    strMeasure3: "200g",
    strIngredient4: "Eggs",
    strMeasure4: "2 large",
    strIngredient5: "Peanuts",
    strMeasure5: "50g crushed",
    cookingTime: "30 mins",
    difficulty: "Medium"
  },
  {
    idMeal: "5",
    strMeal: "Caesar Salad",
    strMealThumb: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    strCategory: "Vegetarian",
    strArea: "American",
    strInstructions: "Wash and chop romaine lettuce. Make dressing with anchovies, garlic, lemon, and parmesan. Toss lettuce with dressing and croutons.",
    strIngredient1: "Romaine lettuce",
    strMeasure1: "2 heads",
    strIngredient2: "Parmesan cheese",
    strMeasure2: "100g",
    strIngredient3: "Croutons",
    strMeasure3: "100g",
    strIngredient4: "Anchovies",
    strMeasure4: "6 fillets",
    strIngredient5: "Lemon",
    strMeasure5: "1 large",
    cookingTime: "15 mins",
    difficulty: "Easy"
  },
  {
    idMeal: "6",
    strMeal: "Margherita Pizza",
    strMealThumb: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    strCategory: "Italian",
    strArea: "Italian",
    strInstructions: "Roll out pizza dough. Spread tomato sauce, add mozzarella and basil. Bake at 220°C for 12-15 minutes until golden.",
    strIngredient1: "Pizza dough",
    strMeasure1: "1 ball",
    strIngredient2: "Tomato sauce",
    strMeasure2: "200ml",
    strIngredient3: "Mozzarella",
    strMeasure3: "200g",
    strIngredient4: "Fresh basil",
    strMeasure4: "20 leaves",
    strIngredient5: "Olive oil",
    strMeasure5: "2 tbsp",
    cookingTime: "25 mins",
    difficulty: "Easy"
  },
  {
    idMeal: "7",
    strMeal: "Chicken Curry",
    strMealThumb: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
    strCategory: "Indian",
    strArea: "Indian",
    strInstructions: "Sauté onions, add spices, tomatoes, and coconut milk. Add chicken and simmer until cooked. Serve with rice.",
    strIngredient1: "Chicken thighs",
    strMeasure1: "600g",
    strIngredient2: "Coconut milk",
    strMeasure2: "400ml",
    strIngredient3: "Onions",
    strMeasure3: "2 large",
    strIngredient4: "Curry powder",
    strMeasure4: "3 tbsp",
    strIngredient5: "Tomatoes",
    strMeasure5: "400g canned",
    cookingTime: "40 mins",
    difficulty: "Medium"
  },
  {
    idMeal: "8",
    strMeal: "Greek Salad",
    strMealThumb: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
    strCategory: "Vegetarian",
    strArea: "Greek",
    strInstructions: "Chop tomatoes, cucumbers, and onions. Add olives and feta cheese. Dress with olive oil, lemon juice, and oregano.",
    strIngredient1: "Tomatoes",
    strMeasure1: "4 large",
    strIngredient2: "Cucumber",
    strMeasure2: "1 large",
    strIngredient3: "Feta cheese",
    strMeasure3: "200g",
    strIngredient4: "Olives",
    strMeasure4: "100g",
    strIngredient5: "Red onion",
    strMeasure5: "1 medium",
    cookingTime: "10 mins",
    difficulty: "Easy"
  }
];

const CATEGORIES = {
  Italian: ["1", "6"],
  Indian: ["2", "7"],
  Mexican: ["3"],
  Asian: ["4"],
  Vegetarian: ["5", "8"],
  American: ["5"]
};

class RecipeAPI {
  // Get random recipes for home screen
  static async getRandomRecipes(count = 6) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const shuffled = [...MOCK_RECIPES].sort(() => 0.5 - Math.random());
      return {
        meals: shuffled.slice(0, count)
      };
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      throw error;
    }
  }

  // Get recipes by category
  static async getRecipesByCategory(category) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const categoryIds = CATEGORIES[category] || [];
      const recipes = MOCK_RECIPES.filter(recipe => 
        categoryIds.includes(recipe.idMeal) || recipe.strCategory === category
      );
      
      return {
        meals: recipes
      };
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      throw error;
    }
  }

  // Search recipes by name
  static async searchRecipes(query) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (!query.trim()) {
        return { meals: [] };
      }
      
      const filtered = MOCK_RECIPES.filter(recipe =>
        recipe.strMeal.toLowerCase().includes(query.toLowerCase()) ||
        recipe.strCategory.toLowerCase().includes(query.toLowerCase()) ||
        recipe.strArea.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        meals: filtered
      };
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }

  // Get recipe by ID
  static async getRecipeById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const recipe = MOCK_RECIPES.find(recipe => recipe.idMeal === id);
      return {
        meals: recipe ? [recipe] : []
      };
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      throw error;
    }
  }

  // Get all available categories
  static getCategories() {
    return Object.keys(CATEGORIES);
  }
}

export default RecipeAPI;
