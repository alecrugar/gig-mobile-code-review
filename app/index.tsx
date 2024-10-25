import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const GameScreen = () => {
  const [games, setGames] = useState<any>([]);
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
        setGames(formattedGames);
        setFilteredGames(formattedGames);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = games.filter((game: any) =>
      game.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [search]);

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
        renderItem={({ item }) => <Text>{item.displayName}</Text>}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default GameScreen;
