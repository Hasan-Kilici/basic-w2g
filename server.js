const http = require("http");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

const cookieParser = require("cookie-parser");

app.use(cookieParser());
const port = 8080;
//Body Parser
app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//Statik
app.use(express.static("public"));
app.set("src", "path/to/views");

const dbURL = process.env.db;
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    server.listen(port, () => {
      console.log("mongoDB Bağlantı kuruldu");
    });
  })
  .catch((err) => console.log(err));
//Socket
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chance-video', (link)=>{
    io.emit('chance-video', link)
  })
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

//Collections
let Users = require('./models/users.js')

app.get('/',(req,res)=>{
  var userId = req.cookies.id;
  if(userId != null){
    Users.findById(userId).then((UserResult)=>{
      res.render(`${__dirname}/src/pages/index.ejs`,{user:UserResult})
    })
  } else {
    res.render(`${__dirname}/src/pages/login.ejs`)
  }
})

app.post('/login',(req,res)=>{
  var userId = req.cookies.id;
  if(userId != null){
    res.redirect('/')
  } else {
   var user = new Users({
   username : req.body.username
   })
   user.save()
   .then((UserResult)=>{
   res.cookie('id', UserResult._id)
   res.redirect('/')
   })
  }
})
