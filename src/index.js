const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const { createNewLobby } = require('./lobby/createNewLobby');
const { joinLobby } = require('./lobby/joinLobby');
const {
  getUsersInLobby,
  startLobbyGame,
  removeUserWithouLobbyId,
} = require('./functions/lobby');
const { leaveLobby } = require('./lobby/leaveLobby');

io.on('connection', (socket) => {
  createNewLobby(io, socket);
  joinLobby(io, socket);
  leaveLobby(io, socket);

  socket.on('startGame', ({ lobbyId }) => {
    startLobbyGame(lobbyId);
    io.to(lobbyId).emit('gameStarted', {
      gameInProgress: true,
    });
  });

  socket.on('disconnect', () => {
    const user = removeUserWithouLobbyId(socket.id);
    if (user) {
      socket.broadcast.to(user.lobbyId).emit('updateLobbyUsers', {
        users: getUsersInLobby(user.lobbyId),
      });
    }
  });
});

httpServer.listen(8080, () => {
  console.log('listening on *:8080');
});
