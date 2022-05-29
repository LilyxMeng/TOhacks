const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { Client } = require('pg')

const client = new Client(process.env.DATABASE_URL)

client.connect()


app.use('/static', express.static(__dirname + '/public'));

app.get('/', (req, res) => {

  res.sendFile(__dirname + '/public/homepage.html');
});

app.get('/canvas', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get('/tutorial', (req, res) => {
  res.sendFile(__dirname + "/public/tutorial.html");
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/public/about.html');
});

io.on('connection', (socket) => {
    client.query('SELECT * FROM pixels', (err, res) => {
      socket.emit("data", res.rows);
      console.log(res.rows, "data")
    })

    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
      //insert msg.X, msg.Y, msg.F into database

      // if msg.X and msg.Y are in database, update database with new color
      // else insert new row into database
      client.query('INSERT INTO pixels (x, y, Color) VALUES ($1, $2, $3)', [msg.X, msg.Y, msg.F], (err, res) => {
        if (err) {
          console.log("Duplicate entry");
          // find row with same x and y
          // update color
          client.query('UPDATE pixels SET Color = $1 WHERE x = $2 AND y = $3', [msg.F, msg.X, msg.Y], (err, res) => {
            if (err) {
              console.log(err)
            }
          })
        }
      });
      
      console.log('message: ' + msg.X + ' ' + msg.Y + ' ' + msg.F);
      console.log("YAYA");
      });
  });

server.listen(8080, () => {
  console.log('listening on *:8080');
});
