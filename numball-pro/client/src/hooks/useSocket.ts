import { useEffect, useCallback } from 'react';
import { useSocketContext } from '../contexts/SocketContext';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setGameStarted,
  setGamePlaying,
  setMyTurn,
  setOpponentTurn,
  addMyGuess,
  addOpponentGuess,
  updateTimeLeft,
  setGameEnded,
  resetGame,
} from '../store/gameSlice';
import { updateUser } from '../store/authSlice';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const { socket, isConnected, connect, disconnect } = useSocketContext();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!socket) return;

    // Game events
    socket.on('game:started', (data) => {
      const myIndex = data.players.findIndex((p) => p.id === user?.id);
      dispatch(
        setGameStarted({
          gameId: data.gameId,
          roomCode: data.roomCode,
          mode: data.mode,
          config: data.config,
          myIndex,
          players: data.players,
        })
      );
      toast.success('Game started! Set your secret number.');
    });

    socket.on('game:allSecretsSet', () => {
      dispatch(setGamePlaying());
      toast.success('All secrets set! Game begins.');
    });

    socket.on('game:yourTurn', (data) => {
      dispatch(setMyTurn({ timeLimit: data.timeLimit, turnNumber: data.turnNumber }));
      toast('Your turn!', { icon: '🎯' });
    });

    socket.on('game:opponentTurn', (data) => {
      dispatch(setOpponentTurn({ turnNumber: data.turnNumber }));
    });

    socket.on('game:guessResult', (data) => {
      if (data.playerId === user?.id) {
        dispatch(addMyGuess(data.result));
      } else {
        dispatch(addOpponentGuess(data.result));
      }
    });

    socket.on('game:timeUpdate', (data) => {
      dispatch(updateTimeLeft(data.timeLeft));
    });

    socket.on('game:ended', (data) => {
      const myResult = data.results.find((r) => r.playerId === user?.id);
      const opponent = data.results.find((r) => r.playerId !== user?.id);

      if (myResult) {
        dispatch(
          setGameEnded({
            type: myResult.isWinner ? 'WIN' : opponent?.isWinner ? 'LOSE' : 'DRAW',
            reason: data.reason,
            opponentSecret: opponent?.secret || '',
            ratingChange: myResult.ratingChange,
            coinsEarned: myResult.coinsEarned,
            expEarned: myResult.expEarned,
          })
        );

        // Update user stats
        dispatch(
          updateUser({
            rating: (user?.rating || 0) + myResult.ratingChange,
            coins: (user?.coins || 0) + myResult.coinsEarned,
          })
        );

        if (myResult.isWinner) {
          toast.success('You won! 🎉');
        } else if (opponent?.isWinner) {
          toast.error('You lost! 😢');
        } else {
          toast('Draw!', { icon: '🤝' });
        }
      }
    });

    socket.on('game:hint', (data) => {
      toast(data.hint, { icon: '💡', duration: 5000 });
    });

    // Room events
    socket.on('room:playerJoined', (data) => {
      toast.success(`${data.player.username} joined the room`);
    });

    socket.on('room:playerLeft', (data) => {
      toast(`${data.username} left the room`, { icon: '👋' });
    });

    // Match events
    socket.on('match:found', (data) => {
      toast.success(`Match found! Opponent: ${data.opponent.username}`);
    });

    // Error events
    socket.on('error', (data) => {
      toast.error(data.message);
    });

    return () => {
      socket.off('game:started');
      socket.off('game:allSecretsSet');
      socket.off('game:yourTurn');
      socket.off('game:opponentTurn');
      socket.off('game:guessResult');
      socket.off('game:timeUpdate');
      socket.off('game:ended');
      socket.off('game:hint');
      socket.off('room:playerJoined');
      socket.off('room:playerLeft');
      socket.off('match:found');
      socket.off('error');
    };
  }, [socket, dispatch, user?.id, user?.rating, user?.coins]);

  // Socket actions
  const createRoom = useCallback(
    (settings: any) => {
      socket?.emit('room:create', settings);
    },
    [socket]
  );

  const joinRoom = useCallback(
    (roomCode: string) => {
      socket?.emit('room:join', { roomCode });
    },
    [socket]
  );

  const leaveRoom = useCallback(
    (roomCode: string) => {
      socket?.emit('room:leave', { roomCode });
      dispatch(resetGame());
    },
    [socket, dispatch]
  );

  const setReady = useCallback(
    (roomCode: string, ready: boolean) => {
      socket?.emit('room:ready', { roomCode, ready });
    },
    [socket]
  );

  const setSecret = useCallback(
    (gameId: string, secret: string) => {
      socket?.emit('game:setSecret', { gameId, secret });
    },
    [socket]
  );

  const makeGuess = useCallback(
    (gameId: string, guess: string) => {
      socket?.emit('game:guess', { gameId, guess });
    },
    [socket]
  );

  const requestHint = useCallback(
    (gameId: string, level: 1 | 2 | 3) => {
      socket?.emit('game:requestHint', { gameId, level });
    },
    [socket]
  );

  const surrender = useCallback(
    (gameId: string) => {
      socket?.emit('game:surrender', { gameId });
    },
    [socket]
  );

  const startMatchmaking = useCallback(
    (mode: string) => {
      socket?.emit('match:join', { mode });
      toast('Searching for opponent...', { icon: '🔍' });
    },
    [socket]
  );

  const cancelMatchmaking = useCallback(() => {
    socket?.emit('match:cancel');
    toast('Matchmaking cancelled');
  }, [socket]);

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    leaveRoom,
    setReady,
    setSecret,
    makeGuess,
    requestHint,
    surrender,
    startMatchmaking,
    cancelMatchmaking,
  };
};
