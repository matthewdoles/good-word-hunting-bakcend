import { getLobbyIdIndex } from '../functions/util.js';
import { lobbies } from '../index.js';

export const startGame = (io, socket) => {
  socket.on('startGame', ({ lobbyId, media }, callback) => {
    const lobbyIndex = getLobbyIdIndex(lobbyId);
    if (lobbyIndex == -1) {
      return callback('Trouble starting game.');
    }

    lobbies[lobbyIndex].gameInProgress = true;
    lobbies[lobbyIndex].media = media;

    io.to(lobbyId).emit('gameStarted', {
      gameInProgress: lobbies[lobbyIndex].gameInProgress,
      round: lobbies[lobbyIndex].round,
      media: lobbies[lobbyIndex].media,
    });
  });
};
