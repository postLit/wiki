const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require('fs');

const gamedirectory = path.join(__dirname, "html");

app = express();

app.use(express.static(gamedirectory));
app.use(cookieParser());
app.use(express.static(__dirname + "/"));
app.use(
  bodyParser.urlencoded({
    extend: true,
  })
);

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname);
const PORT = 3000;

Object.prototype.sendRenderedFile = async function(file, info) {
  var res = this
  fs.readFile(path.join(__dirname, file), function(err, data) {
    var text = data.toString()
    Object.keys(info).forEach(function(el) {
    text = text.replaceAll("<%= "+el+" %>", info[el])
  })
  res.send(text)
  })
}

app.get("/", function(req, res) {
    res.sendRenderedFile("/pages/main.html", {
      text: "<img src='/images/main.png'><h4><a href='/wiki/postlit/'>postLit.dev</a></h34<a href='/users/rgantzos/'>yeah</a> i agree with that entirely".toString()
    })
})

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, "/pages/404.html"))
})

app.listen(PORT);