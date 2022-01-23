const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const {
  addUser,
  removeUser,
  getUsersInRoom,
  startGame,
  getGameInProgress,
} = require('./functions/users');
const { generateRoomNumber } = require('./functions/util');

io.on('connection', (socket) => {
  socket.on('createRoom', (userInfo, callback) => {
    const roomNumber = generateRoomNumber(4);
    const { error, user } = addUser({
      id: socket.id,
      username: userInfo.username,
      profileImage: userInfo.profileImage,
      isAdmin: true,
      room: roomNumber,
    });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    io.to(user.id).emit('userInfo', {
      id: user.id,
      room: user.room,
    });
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on('joinRoom', (userInfo, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username: userInfo.username,
      profileImage: userInfo.profileImage,
      isAdmin: false,
      room: userInfo.roomNumber,
    });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    io.to(user.id).emit('userInfo', {
      id: user.id,
      room: user.room,
    });
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
      gameInProgress: getGameInProgress(),
    });
    callback();
  });

  socket.on('startGame', ({ room }) => {
    startGame();
    socket.broadcast.to(room).emit('gameStarted');
  });

  socket.on('leaveRoom', ({ id }) => {
    const user = removeUser(id);
    if (user) {
      socket.broadcast.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
        gameInProgress: getGameInProgress(),
      });
    }
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
        gameInProgress: getGameInProgress(),
      });
    }
  });
});

httpServer.listen(8080, () => {
  console.log('listening on *:8080');
});
