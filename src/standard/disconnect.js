import {
  getLobbyIdIndex,
  removeIfEmptyLobby,
  removeUserWithouLobbyId,
} from '../functions/util.js';
import { lobbies } from '../index.js';

export const disconnect = (io, socket) => {
  socket.on('disconnect', () => {
    const user = removeUserWithouLobbyId(socket.id);
    if (user) {
      const lobbyIndex = getLobbyIdIndex(user.lobbyId);
      if (lobbyIndex != -1) {
        const isEmpty = removeIfEmptyLobby(lobbyIndex);
        if (!isEmpty) {
          io.to(user.lobbyId).emit('updateLobbyUsers', {
            users: lobbies[lobbyIndex].users,
          });
        }
      }
    }
  });
};
