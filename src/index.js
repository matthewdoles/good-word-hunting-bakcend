import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'https://good-word-hunting.vercel.app',
  },
});

import { createNewLobby } from './lobby/createNewLobby.js';
import { joinLobby } from './lobby/joinLobby.js';
import { leaveLobby } from './lobby/leaveLobby.js';
import {
  getUsersInLobby,
  startLobbyGame,
  removeUserWithouLobbyId,
  getLobbyGameProgress,
  submitUserGuess,
  checkUsersDoneGuessing,
} from './functions/lobby.js';

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
const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});
