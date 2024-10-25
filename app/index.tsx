import { AppDispatch, RootState } from '@/store';
import { setGames, toggleFavorite } from '@/store/gameSlice';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const GameScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const games = useSelector((state: any) => state.game.games);
  const favorites = useSelector((state: RootState) => state.game.favorites);

  const [filteredGames, setFilteredGames] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost/api/games')
      .then((response) => response.json())
      .then((data) => {
        const formattedGames: any[] = [];
        for (let i = 0; i < data.length; i++) {
          formattedGames.push({
            ...data[i],
            displayName: `${data[i].name} - Category: ${data[i].category}`,
          });
        }
        dispatch(setGames(formattedGames));
        setFilteredGames(formattedGames);
        setLoading(false);
      });
  }, [dispatch, games]);

  useEffect(() => {
    const filtered = games.filter((game: any) =>
      game.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [search]);

  const handleToggleFavorite = (gameId: number) => {
    dispatch(toggleFavorite(gameId));
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View>
      <TextInput
        placeholder="Search games..."
        value={search}
        onChangeText={setSearch}
        style={{
          padding: 10,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
        }}
      />
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.gameContainer}>
            <Text>{item.displayName}</Text>
            <TouchableOpacity
              onPress={() => handleToggleFavorite(item.id)}
              style={{
                padding: 5,
                backgroundColor: favorites.includes(item.id)
                  ? 'gold'
                  : 'lightgray',
                borderRadius: 5,
              }}
            >
              <Text>
                {favorites.includes(item.id) ? 'Unfavorite' : 'Favorite'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default GameScreen;
