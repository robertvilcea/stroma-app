import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import { useWatchlist } from '../context/WatchlistContext';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { searchTMDB, getWatchProviders } from '../tmdb';

type MediaItem = {
  id: string;
  title: string;
  poster: string;
  availableOn: string[];
};

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { watchlist, toggleWatchlist } = useWatchlist();
  const pulseAnim = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const rawResults = await searchTMDB(query);
        const filtered = rawResults.filter(
          (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
        );

        const enriched = await Promise.all(
          filtered.slice(0, 6).map(async (item: any) => {
            const id = item.id.toString();
            if (!pulseAnim[id]) pulseAnim[id] = new Animated.Value(1);

            const providers = await getWatchProviders(item.id, item.media_type);
            return {
              id,
              title: item.title || item.name,
              poster: item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : '',
              availableOn: providers?.flatrate?.map((p: any) => p.provider_name) || [],
            };
          })
        );

        setResults(enriched);
      } catch (err) {
        console.error('TMDb error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const handleToggleWatchlist = (item: MediaItem) => {
    const alreadyAdded = watchlist.some((w) => w.id === item.id);

    Animated.sequence([
      Animated.timing(pulseAnim[item.id], {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim[item.id], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    toggleWatchlist(item);

    Toast.show({
      type: 'custom',
      text1: alreadyAdded ? 'Removed from Watchlist' : 'Added to Watchlist',
      position: 'bottom',
    });
  };

  return (
    <>
      <StatusBar style="light" translucent={false} backgroundColor="#000" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>STROMA</Text>

        <TextInput
          placeholder="Search for a title..."
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />

        {loading && (
          <ActivityIndicator size="large" color="#4f46e5" style={{ marginBottom: 16 }} />
        )}

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isInWatchlist = watchlist.some((w) => w.id === item.id);
            return (
              <View style={styles.card}>
                {item.poster ? (
                  <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" />
                ) : null}
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSub}>
                    Available on:{' '}
                    {item.availableOn.length > 0
                      ? item.availableOn.join(', ')
                      : 'Not available in RO'}
                  </Text>
                  <Pressable onPress={() => handleToggleWatchlist(item)}>
                    <Animated.View
                      style={[
                        styles.iconButton,
                        { transform: [{ scale: pulseAnim[item.id] || new Animated.Value(1) }] },
                      ]}
                    >
                      <Text style={styles.emoji}>{isInWatchlist ? '💜' : '➕'}</Text>
                    </Animated.View>
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            !loading && query.length > 0 ? (
              <Text style={styles.emptyText}>No results found.</Text>
            ) : null
          }
        />

        <View style={styles.watchlist}>
          <Text style={styles.watchlistTitle}>Watchlist</Text>
          {watchlist.length === 0 ? (
            <Text style={styles.emptyText}>Your watchlist is empty.</Text>
          ) : (
            watchlist.map((item) => (
              <Text key={item.id} style={styles.watchlistItem}>
                • {item.title}
              </Text>
            ))
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    backgroundColor: '#222',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  emoji: {
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#111111',
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 12,
    marginRight: 20,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSub: {
    color: '#bbbbbb',
    fontSize: 13,
    marginBottom: 12,
  },
  emptyText: {
    color: '#888888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
  watchlist: {
    marginTop: 32,
  },
  watchlistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  watchlistItem: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 4,
  },
});
