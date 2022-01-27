import {
  getLobbyIdIndex,
  getUserIndex,
  removeIfEmptyLobby,
  removeUser,
} from '../functions/util.js';
import { lobbies } from '../index.js';

export const leaveLobby = (io, socket) => {
  socket.on('leaveLobby', ({ lobbyId, userId }, callback) => {
    const lobbyIndex = getLobbyIdIndex(lobbyId);
    if (lobbyIndex == -1) {
      return callback('Cannot find lobby.');
    }
    const userIndex = getUserIndex(lobbyIndex, userId);
    if (userIndex == -1) {
      return callback('Cannot find user in lobby.');
    }

    removeUser(lobbyIndex, userIndex);
    const isEmpty = removeIfEmptyLobby(lobbyIndex);
    if (!isEmpty) {
      io.to(lobbyId).emit('updateLobbyUsers', {
        users: lobbies[lobbyIndex].users,
      });
    }
  });
};
