import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import open from 'open';
import { join } from 'path';
import { cwd } from 'process';
import { Server } from 'socket.io';
const config = JSON.parse(fs.readFileSync(join(cwd() + '/live-server.json')));

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

server.listen(config.server.port, config.server.host, () => {
  console.log(
    `Server running on port: http://${config.server.host}:${config.server.port}`
  );
  open(`http://${config.server.host}:${config.server.port}`);
});
