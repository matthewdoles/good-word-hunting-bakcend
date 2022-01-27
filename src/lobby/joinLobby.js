import { addUser, getLobbyIdIndex } from '../functions/util.js';
import { lobbies } from '../index.js';

export const joinLobby = (io, socket) => {
  socket.on('joinLobby', ({ lobbyId, profileImage, username }, callback) => {
    const lobbyIndex = getLobbyIdIndex(lobbyId);
    if (lobbyIndex == -1) {
      return callback('Cannot connect to lobby.');
    }

    const userId = addUser(lobbyIndex, {
      id: socket.id,
      isAdmin: false,
      lobbyId,
      profileImage,
      username,
    });

    socket.join(lobbyId);

    io.to(userId).emit('userInfo', {
      id: userId,
      lobbyId,
    });

    io.to(user.id).emit('gameStarted', {
      gameInProgress: lobbies[lobbyIndex].gameInProgress,
      mediaId: lobbies[lobbyIndex].mediaId,
    });

    io.to(user.lobbyId).emit('updateLobbyUsers', {
      users: lobbies[lobbyIndex].users,
    });
    callback();
  });
};
