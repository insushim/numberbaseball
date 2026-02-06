import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameMode } from '@numball/shared';

interface RoomPlayer {
  id: string;
  username: string;
  isReady: boolean;
  isHost: boolean;
  rating: number;
  tier: string;
}

interface Room {
  code: string;
  hostId: string;
  mode: GameMode;
  maxPlayers: number;
  isPrivate: boolean;
  players: RoomPlayer[];
  status: 'waiting' | 'starting' | 'in_game';
}

interface LobbyState {
  currentRoom: Room | null;
  publicRooms: Room[];
  isInQueue: boolean;
  queueMode: GameMode | null;
  queueStartTime: number | null;
}

const initialState: LobbyState = {
  currentRoom: null,
  publicRooms: [],
  isInQueue: false,
  queueMode: null,
  queueStartTime: null,
};

const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<Room | null>) => {
      state.currentRoom = action.payload;
    },

    updateRoom: (state, action: PayloadAction<Partial<Room>>) => {
      if (state.currentRoom) {
        state.currentRoom = { ...state.currentRoom, ...action.payload };
      }
    },

    addPlayerToRoom: (state, action: PayloadAction<RoomPlayer>) => {
      if (state.currentRoom) {
        const exists = state.currentRoom.players.some(
          (p) => p.id === action.payload.id
        );
        if (!exists) {
          state.currentRoom.players.push(action.payload);
        }
      }
    },

    removePlayerFromRoom: (state, action: PayloadAction<string>) => {
      if (state.currentRoom) {
        state.currentRoom.players = state.currentRoom.players.filter(
          (p) => p.id !== action.payload
        );
      }
    },

    updatePlayerReady: (
      state,
      action: PayloadAction<{ playerId: string; ready: boolean }>
    ) => {
      if (state.currentRoom) {
        const player = state.currentRoom.players.find(
          (p) => p.id === action.payload.playerId
        );
        if (player) {
          player.isReady = action.payload.ready;
        }
      }
    },

    setPublicRooms: (state, action: PayloadAction<Room[]>) => {
      state.publicRooms = action.payload;
    },

    startQueue: (state, action: PayloadAction<GameMode>) => {
      state.isInQueue = true;
      state.queueMode = action.payload;
      state.queueStartTime = Date.now();
    },

    stopQueue: (state) => {
      state.isInQueue = false;
      state.queueMode = null;
      state.queueStartTime = null;
    },

    leaveRoom: (state) => {
      state.currentRoom = null;
    },

    resetLobby: () => initialState,
  },
});

export const {
  setCurrentRoom,
  updateRoom,
  addPlayerToRoom,
  removePlayerFromRoom,
  updatePlayerReady,
  setPublicRooms,
  startQueue,
  stopQueue,
  leaveRoom,
  resetLobby,
} = lobbySlice.actions;

export default lobbySlice.reducer;
