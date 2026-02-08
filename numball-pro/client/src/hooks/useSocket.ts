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
  const { socket, isConnected, connectionError, connect, disconnect } = useSocketContext();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!socket) return;

    // Game events
    socket.on('game:started', (data) => {
      const myIndex = data.players.findIndex((p) => p.userId === user?.id);
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
      toast.success('게임 시작! 비밀 숫자를 설정하세요.');
    });

    socket.on('game:allSecretsSet', () => {
      dispatch(setGamePlaying());
      toast.success('모든 비밀 숫자 설정 완료! 게임 시작.');
    });

    socket.on('game:yourTurn', (data) => {
      dispatch(setMyTurn({ timeLimit: data.timeLimit, turnNumber: data.turnNumber }));
      toast('내 차례!', { icon: '🎯' });
    });

    socket.on('game:opponentTurn', (data) => {
      dispatch(setOpponentTurn({ turnNumber: data.turnNumber }));
    });

    socket.on('game:guessResult', (data) => {
      const guessResult = {
        guess: data.guess,
        strikes: data.strikes,
        balls: data.balls,
        timestamp: Date.now(),
        turnNumber: data.turnNumber,
        timeSpent: data.timeSpent,
      };
      if (data.oderId === user?.id) {
        dispatch(addMyGuess(guessResult));
      } else {
        dispatch(addOpponentGuess(guessResult));
      }
    });

    socket.on('game:timeWarning', (data) => {
      dispatch(updateTimeLeft(data.secondsLeft));
    });

    socket.on('game:ended', (data) => {
      dispatch(
        setGameEnded({
          type: data.result,
          reason: data.reason,
          opponentSecret: data.opponentSecret,
          ratingChange: data.ratingChange,
          coinsEarned: data.coinsEarned,
          expEarned: data.expEarned,
        })
      );

      // Update user stats
      dispatch(
        updateUser({
          rating: (user?.rating || 0) + data.ratingChange,
          coins: (user?.coins || 0) + data.coinsEarned,
        })
      );

      if (data.result === 'WIN') {
        toast.success('승리! 🎉');
      } else if (data.result === 'LOSE') {
        toast.error('패배! 😢');
      } else {
        toast('무승부!', { icon: '🤝' });
      }
    });

    socket.on('game:hintResult', (data) => {
      toast(data.hint.content, { icon: '💡', duration: 5000 });
    });

    // Room events
    socket.on('room:playerJoined', (data) => {
      toast.success(`${data.player.username}님이 입장했습니다`);
    });

    socket.on('room:playerLeft', (data) => {
      toast(`플레이어가 방을 나갔습니다`, { icon: '👋' });
    });

    // Match events
    socket.on('matchmaking:found', (data) => {
      toast.success(`매치 성공! 상대: ${data.opponent.username}`);
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
      socket.off('game:timeWarning');
      socket.off('game:ended');
      socket.off('game:hintResult');
      socket.off('room:playerJoined');
      socket.off('room:playerLeft');
      socket.off('matchmaking:found');
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
    (_roomCode?: string) => {
      socket?.emit('room:leave');
      dispatch(resetGame());
    },
    [socket, dispatch]
  );

  const setReady = useCallback(
    (_roomCode: string, ready: boolean) => {
      socket?.emit('room:ready', { isReady: ready });
    },
    [socket]
  );

  const setSecret = useCallback(
    (_gameId: string, secret: string) => {
      socket?.emit('game:setSecret', { secret });
    },
    [socket]
  );

  const makeGuess = useCallback(
    (_gameId: string, guess: string) => {
      socket?.emit('game:guess', { guess });
    },
    [socket]
  );

  const requestHint = useCallback(
    (_gameId: string, level: 1 | 2 | 3) => {
      socket?.emit('game:useHint', { hintLevel: level });
    },
    [socket]
  );

  const surrender = useCallback(
    (_gameId: string) => {
      socket?.emit('game:surrender');
    },
    [socket]
  );

  const startMatchmaking = useCallback(
    (mode: string) => {
      socket?.emit('matchmaking:start', { mode });
      toast('상대를 찾는 중...', { icon: '🔍' });
    },
    [socket]
  );

  const cancelMatchmaking = useCallback(() => {
    socket?.emit('matchmaking:cancel');
    toast('매칭 취소됨');
  }, [socket]);

  return {
    socket,
    isConnected,
    connectionError,
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
