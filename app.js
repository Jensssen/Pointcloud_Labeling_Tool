var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Landing page
app.use("/", indexRouter);
// Get datalake table bage
app.use("/datalake_data", indexRouter);
app.use("/get_datalake_data", indexRouter);
app.use("/labeling_tool/:point_cloud_path", indexRouter);
app.use("/upload_point_cloud/:point_cloud_path", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// use bodyparser for sending json data from client to server
app.use(bodyParser.json());

// use express file uploader package
app.use(fileUpload());

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
