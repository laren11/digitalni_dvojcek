const express = require("express");
const mongoose = require("mongoose");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
const http = require("http");
const createError = require("http-errors");
//const priceController = require("./controllers/priceController");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.listen(3002, () => {
  console.log("listening on *:3002");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // Send initial data to the newly connected user
  //sendTopFive(socket);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

/* function sendTopFive(socket) {
  priceController.getTopFive(null, {
    json: (data) => {
      // Emit the topFiveData to the socket
      socket.emit("top-five-data", data);
    },
    status: () => {}, // No-op for the status function
  });
}

// Send the getTopFive data to all connected users every 30 minutes
setInterval(() => {
  io.sockets.emit("top-five-data", priceController.getTopFive());
}, 30 * 60 * 1000); */

//connect to mongo db
var mongoDB = process.env.MONGO_URI;
mongoose
  .connect(mongoDB)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var indexRouter = require("./routes/index");

//cors for backend-frontend communication
var cors = require("cors");

//allow origins to access your app
var allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8080",
];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var session = require("express-session");
var MongoStore = require("connect-mongo");
app.use(
  session({
    secret: "work hard",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB }),
  })
);
//Shranimo sejne spremenljivke v locals
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

//routes import
app.use("/", indexRouter);
app.use("/users", require("./routes/userRoutes.js"));
app.use("/cryptocurrencies", require("./routes/cryptocurrencyRoutes.js"));
app.use("/prices", require("./routes/priceRoutes.js"));
app.use("/exchanges", require("./routes/exchangeRoutes.js"));
app.use("/atms", require("./routes/atmRoutes.js"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log("ERROR: ", err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json(err);
});

module.exports = app;
