import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameState, GuessResult, GameModeConfig, PlayerGameState } from '@numball/shared';

interface GameSliceState {
  gameId: string | null;
  roomCode: string | null;
  mode: string | null;
  config: GameModeConfig | null;
  status: 'idle' | 'setting_secret' | 'playing' | 'finished';
  isMyTurn: boolean;
  myIndex: number;
  myGuesses: GuessResult[];
  opponentGuesses: GuessResult[];
  mySecret: string;
  opponentSecret: string;
  currentTurn: number;
  timeLeft: number;
  players: PlayerGameState[];
  result: {
    type: 'WIN' | 'LOSE' | 'DRAW' | null;
    reason: string;
    ratingChange: number;
    coinsEarned: number;
    expEarned: number;
  } | null;
}

const initialState: GameSliceState = {
  gameId: null,
  roomCode: null,
  mode: null,
  config: null,
  status: 'idle',
  isMyTurn: false,
  myIndex: 0,
  myGuesses: [],
  opponentGuesses: [],
  mySecret: '',
  opponentSecret: '',
  currentTurn: 0,
  timeLeft: 0,
  players: [],
  result: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameStarted: (
      state,
      action: PayloadAction<{
        gameId: string;
        roomCode: string;
        mode: string;
        config: GameModeConfig;
        myIndex: number;
        players: any[];
      }>
    ) => {
      state.gameId = action.payload.gameId;
      state.roomCode = action.payload.roomCode;
      state.mode = action.payload.mode;
      state.config = action.payload.config;
      state.myIndex = action.payload.myIndex;
      state.players = action.payload.players;
      state.status = 'setting_secret';
      state.myGuesses = [];
      state.opponentGuesses = [];
      state.result = null;
    },

    setSecretPhase: (state) => {
      state.status = 'setting_secret';
    },

    setMySecret: (state, action: PayloadAction<string>) => {
      state.mySecret = action.payload;
    },

    setGamePlaying: (state) => {
      state.status = 'playing';
    },

    setMyTurn: (state, action: PayloadAction<{ timeLimit: number; turnNumber: number }>) => {
      state.isMyTurn = true;
      state.timeLeft = action.payload.timeLimit;
      state.currentTurn = action.payload.turnNumber;
    },

    setOpponentTurn: (state, action: PayloadAction<{ turnNumber: number }>) => {
      state.isMyTurn = false;
      state.currentTurn = action.payload.turnNumber;
    },

    addMyGuess: (state, action: PayloadAction<GuessResult>) => {
      state.myGuesses.push(action.payload);
    },

    addOpponentGuess: (state, action: PayloadAction<GuessResult>) => {
      state.opponentGuesses.push(action.payload);
    },

    updateTimeLeft: (state, action: PayloadAction<number>) => {
      state.timeLeft = action.payload;
    },

    setGameEnded: (
      state,
      action: PayloadAction<{
        type: 'WIN' | 'LOSE' | 'DRAW';
        reason: string;
        opponentSecret: string;
        ratingChange: number;
        coinsEarned: number;
        expEarned: number;
      }>
    ) => {
      state.status = 'finished';
      state.opponentSecret = action.payload.opponentSecret;
      state.result = {
        type: action.payload.type,
        reason: action.payload.reason,
        ratingChange: action.payload.ratingChange,
        coinsEarned: action.payload.coinsEarned,
        expEarned: action.payload.expEarned,
      };
    },

    resetGame: () => initialState,
  },
});

export const {
  setGameStarted,
  setSecretPhase,
  setMySecret,
  setGamePlaying,
  setMyTurn,
  setOpponentTurn,
  addMyGuess,
  addOpponentGuess,
  updateTimeLeft,
  setGameEnded,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
