const { navbar } = require("./components/navbar.js")

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
    text = text.replace("<body>", "<body>"+navbar)
    Object.keys(info).forEach(function(el) {
    text = text.replaceAll("<%= "+el+" %>", info[el])
  })
  res.send(text)
  })
}

function getPageData(file, part) {
  try {
  var text = fs.readFileSync(path.join(__dirname, file), 'utf8')
  if (part) {
    const parts = {
      title: ['<h1 class="title">', '</h1>']
    }
    text = text.split(parts[part][0])[1].split(parts[part][1])[0]
  }
  return text.toString()
  } catch(err) {
    return null
  }
}

app.get("/", async function(req, res) {
    res.sendRenderedFile("/html/main.html", {
      text: getPageData("/pages/postlit-dev.html"),
      box2Head: "Verification",
      box2Text: getPageData("/pages/verification.html"),
      box3Head: "Moderation",
      box3Text: getPageData("/pages/moderation.html")
    })
})

app.get("/random/", async function(req, res) {
  var files = fs.readdirSync(path.join(__dirname, "/pages"))
  res.redirect("/pages/"+(files[Math.floor(Math.random() * files.length)]).replace(".html", "")+"/")
})

app.get("/pages/:page/", async function(req, res, next) {
  if (getPageData("/pages/"+req.params.page+".html")) {
    res.sendRenderedFile("/html/page.html", {
      title: getPageData("/pages/"+req.params.page+".html", "title"),
      content: getPageData("/pages/"+req.params.page+".html")
    })
  } else {
    next()
  }
})

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, "/html/404.html"))
})

app.listen(PORT);