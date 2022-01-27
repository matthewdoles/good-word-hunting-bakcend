import { getLobbyIdIndex } from '../functions/util.js';
import { lobbies } from '../index.js';

export const startNewRound = (io, socket) => {
  socket.on('newRoundStarted', ({ lobbyId, media }, callback) => {
    const lobbyIndex = getLobbyIdIndex(lobbyId);
    if (lobbyIndex == -1) {
      return callback('Trouble starting round.');
    }

    lobbies[lobbyIndex].round = lobbies[lobbyIndex].round + 1;
    lobbies[lobbyIndex].media = media;
    lobbies[lobbyIndex].users.forEach((user) => (user.isGuessing = true));

    io.to(lobbyId).emit('roundStarted', {
      round: lobbies[lobbyIndex].round,
      media: lobbies[lobbyIndex].media,
      users: lobbies[lobbyIndex].users,
    });
  });
};
