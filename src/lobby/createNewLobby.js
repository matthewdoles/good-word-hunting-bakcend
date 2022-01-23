const { createLobby, addUser, getUsersInLobby } = require('../functions/lobby');

const createNewLobby = (io, socket) => {
  socket.on('createLobby', ({ profileImage, username }, callback) => {
    const newLobby = createLobby();
    const { error, user } = addUser({
      id: socket.id,
      isAdmin: true,
      profileImage: profileImage,
      username: username,
      lobbyId: newLobby.lobbyId,
    });
    if (error) {
      return callback(error);
    }

    socket.join(newLobby.lobbyId);

    io.to(user.id).emit('userInfo', {
      id: user.id,
      lobbyId: newLobby.lobbyId,
    });

    io.to(newLobby.lobbyId).emit('updateLobbyUsers', {
      users: getUsersInLobby(user.lobbyId),
    });
    callback();
  });
};

module.exports = {
  createNewLobby,
};
