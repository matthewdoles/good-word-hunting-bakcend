import { getLobbyIdIndex } from '../functions/util.js';
import { lobbies } from '../index.js';

export const startGame = (io, socket) => {
  socket.on('startGame', ({ lobbyId, mediaId }, callback) => {
    const lobbyIndex = getLobbyIdIndex(lobbyId);
    if (lobbyIndex == -1) {
      return callback('Trouble starting game.');
    }

    lobbies[lobbyIndex].gameInProgress = true;
    lobbies[lobbyIndex].mediaId = mediaId;

    io.to(lobbyId).emit('gameStarted', {
      gameInProgress: lobbies[lobbyIndex].gameInProgress,
      mediaId: lobbies[lobbyIndex].mediaId,
    });
  });
};
