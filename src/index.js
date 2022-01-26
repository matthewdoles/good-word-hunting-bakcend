const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'https://good-word-hunting.vercel.app/*',
  },
});

const { createNewLobby } = require('./lobby/createNewLobby');
const { joinLobby } = require('./lobby/joinLobby');
const {
  getUsersInLobby,
  startLobbyGame,
  removeUserWithouLobbyId,
  getLobbyGameProgress,
  submitUserGuess,
  checkUsersDoneGuessing,
} = require('./functions/lobby');
const { leaveLobby } = require('./lobby/leaveLobby');

io.on('connection', (socket) => {
  createNewLobby(io, socket);
  joinLobby(io, socket);
  leaveLobby(io, socket);

  socket.on('startGame', ({ lobbyId, mediaId }) => {
    startLobbyGame(lobbyId, mediaId);
    io.to(lobbyId).emit('gameStarted', {
      ...getLobbyGameProgress(lobbyId),
    });
  });

  socket.on('submitUserGuess', ({ userId, lobbyId, guess, points }) => {
    submitUserGuess(userId, lobbyId, guess, points);
    io.to(lobbyId).emit('updateLobbyUsers', {
      users: getUsersInLobby(lobbyId),
    });
    if (checkUsersDoneGuessing(lobbyId)) {
      io.to(lobbyId).emit('lobbyDoneGuessing');
    }
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

httpServer.listen(process.env.PORT || 8080, () => {
  console.log('listening on *:8080');
});
