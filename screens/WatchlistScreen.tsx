// screens/WatchlistScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useWatchlist } from '../context/WatchlistContext';

export default function WatchlistScreen() {
  const { watchlist } = useWatchlist();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Watchlist</Text>
      {watchlist.length === 0 ? (
        <Text style={styles.emptyText}>You haven't added any titles yet.</Text>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.item}>• {item.title}</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  item: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
});
