import {
  checkAdminStillPresent,
  checkUsersDoneGuessing,
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
          const adminPresent = checkAdminStillPresent(lobbyIndex);
          if (!adminPresent) {
            if (lobbies[lobbyIndex].users.length > 0) {
              lobbies[lobbyIndex].users[0].isAdmin = true;
              io.to(lobbies[lobbyIndex].users[0].id).emit('setAsLobbyAdmin');
              io.to(user.lobbyId).emit('updateLobbyUsers', {
                users: lobbies[lobbyIndex].users,
              });
              if (checkUsersDoneGuessing(lobbyIndex)) {
                io.to(user.lobbyId).emit('lobbyDoneGuessing');
              }
            }
          }
        }
      }
    }
  });
};
