const { htmlName } = require('../filename.json');
const cors = require('cors');
const express = require('express');
const http = require('http');
const { join } = require('path');
const { cwd } = require('process');
const fs = require('fs');

const { Server } = require('socket.io');

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({ origin: '*' }));

app.use('/styles', express.static('project/styles'));
app.use('/js', express.static('project/js'));
app.use('/', express.static('project/public'));
app.use('/images', express.static('project/images'));

app.use('/*', (req, res) => res.sendFile(join(cwd() + `/project/${htmlName}`)));

io.on('connection', (socket) => {
  fs.watch('project', { recursive: true }, (eventType, filename) => {
    if (eventType === 'change') {
      socket.emit('reload');
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port: http://localhost:${port}`);
});
