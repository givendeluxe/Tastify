import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ searchTerm, setSearchTerm, onSubmitSearch }) => {
  return (
    <View style={styles.searchContainer}>
      <Icon name="search" size={20} color="#ccc" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search for recipes..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={onSubmitSearch}
      />
      {searchTerm ? (
        <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearButton}>
          <Icon name="close" size={16} color="#fff" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    marginLeft: 8,
    backgroundColor: 'orange',
    borderRadius: 12,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;