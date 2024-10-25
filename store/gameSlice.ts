import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Game {
  id: number;
  name: string;
  category: string;
  displayName: string;
}

interface GameState {
  games: Game[];
  favorites: number[];
}

const initialState: GameState = {
  games: [],
  favorites: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGames: (state, action: PayloadAction<Game[]>) => {
      state.games = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const gameId = action.payload;
      if (state.favorites.includes(gameId)) {
        state.favorites = state.favorites.filter((id) => id !== gameId);
      } else {
        state.favorites.push(gameId);
      }
    },
  },
});

export const { setGames, toggleFavorite } = gameSlice.actions;
export default gameSlice.reducer;
