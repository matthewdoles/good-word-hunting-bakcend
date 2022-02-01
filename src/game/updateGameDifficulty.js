import { getLobbyIdIndex } from '../functions/util.js';
import { lobbies } from '../index.js';

export const updateGameDifficulty = (io, socket) => {
  socket.on('updateGameDifficulty', ({ lobbyId, difficulty }, callback) => {
    const lobbyIndex = getLobbyIdIndex(lobbyId);
    if (lobbyIndex == -1) {
      return callback('Trouble updating lobby.');
    }

    lobbies[lobbyIndex].difficulty = difficulty;

    io.to(lobbyId).emit('difficultyUpdated', {
      difficulty: lobbies[lobbyIndex].difficulty,
    });
  });
};
