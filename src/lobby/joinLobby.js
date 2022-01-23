const {
  addUser,
  getUsersInLobby,
  getLobbyGameProgress,
} = require('../functions/lobby');

const joinLobby = (io, socket) => {
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
      gameInProgress: getLobbyGameProgress(user.lobbyId),
    });

    io.to(user.lobbyId).emit('updateLobbyUsers', {
      users: getUsersInLobby(user.lobbyId),
    });
    callback();
  });
};
module.exports = { joinLobby };
