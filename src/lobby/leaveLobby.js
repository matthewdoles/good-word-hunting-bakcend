import { getUsersInLobby, removeUser } from '../functions/lobby.js';

export const leaveLobby = (io, socket) => {
  socket.on('leaveLobby', ({ lobbyId, userId }) => {
    const user = removeUser(lobbyId, userId);
    if (user) {
      io.to(user.lobbyId).emit('updateLobbyUsers', {
        users: getUsersInLobby(user.lobbyId),
      });
    }
  });
};
