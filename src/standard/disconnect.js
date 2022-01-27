import { getLobbyIdIndex, removeUserWithouLobbyId } from '../functions/util.js';
import { lobbies } from '../index.js';

export const disconnect = (io, socket) => {
  socket.on('disconnect', () => {
    const user = removeUserWithouLobbyId(socket.id);
    if (user) {
      const lobbyIndex = getLobbyIdIndex(lobbyId);
      if (lobbyIndex != -1) {
        io.to(user.lobbyId).emit('updateLobbyUsers', {
          users: lobbies[lobbyIndex].users,
        });
      }
    }
  });
};
