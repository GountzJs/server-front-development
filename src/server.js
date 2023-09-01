const config = require('../live-server.json');
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

app.use(config.styles.url, express.static(config.styles.path));
app.use(config.javascript.url, express.static(config.javascript.path));
app.use(config.public.url, express.static(config.public.path));
app.use(config.assets.url, express.static(config.assets.path));

app.use('/*', (req, res) =>
  res.sendFile(join(cwd() + `${config.html.path}/${config.html.name}`))
);

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
