import {
  addUser,
  createLobby,
  getLobbyIdIndex,
  getUserIndex,
} from '../functions/util.js';
import { lobbies } from '../index.js';

export const createNewLobby = (io, socket) => {
  socket.on('createLobby', ({ profileImage, username }, callback) => {
    if (!username) {
      return callback('Username required!');
    }

    const lobbyId = createLobby();
    const lobbyIndex = getLobbyIdIndex(lobbyId);
    if (lobbyIndex == -1) {
      return callback('Cannot connect to lobby.');
    }
    const userIndex = getUserIndex(lobbyIndex, socket.id);
    if (userIndex == -1) {
      return callback('User already present in lobby.');
    }

    const userId = addUser(lobbyIndex, {
      id: socket.id,
      isAdmin: true,
      profileImage,
      username,
      lobbyId,
    });

    socket.join(lobbyId);

    io.to(userId).emit('userInfo', {
      id: userId,
      lobbyId: lobbyId,
    });

    io.to(lobbyId).emit('updateLobbyUsers', {
      users: lobbies[lobbyIndex].users,
    });
    callback();
  });
};
