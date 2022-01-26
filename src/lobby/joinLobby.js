import {
  addUser,
  getUsersInLobby,
  getLobbyGameProgress,
} from '../functions/lobby.js';

export const joinLobby = (io, socket) => {
  socket.on('joinLobby', (userInfo, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      isAdmin: false,
      lobbyId: userInfo.lobbyId,
      profileImage: userInfo.profileImage,
      username: userInfo.username,
    });
    if (error) {
      return callback(error);
    }

    socket.join(user.lobbyId);

    io.to(user.id).emit('userInfo', {
      id: user.id,
      lobbyId: user.lobbyId,
    });

    io.to(user.id).emit('gameStarted', {
      ...getLobbyGameProgress(user.lobbyId),
    });

    io.to(user.lobbyId).emit('updateLobbyUsers', {
      users: getUsersInLobby(user.lobbyId),
    });
    callback();
  });
};
