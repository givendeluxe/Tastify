import React from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, View } from 'react-native';

const FoodTypeTabs = ({ foodTypes, onSelectType }) => {
  const renderTab = ({ item }) => (
    <TouchableOpacity style={styles.tab} onPress={() => onSelectType(item)}>
      <Text style={styles.tabText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={foodTypes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTab}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  tab: {
    backgroundColor: '#f3f3f3',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default FoodTypeTabs;