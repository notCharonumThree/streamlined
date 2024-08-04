import http from "node:http"
import path from "node:path"
import axios from "axios"
import { createBareServer } from "@tomphttp/bare-server-node"
import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser"
import mime from "mime"
import fetch from "node-fetch"

const __dirname = process.cwd()
const server = http.createServer()
const app = express()
const bareServer = createBareServer("/ov/")
const PORT = process.env.PORT || 8080
const cache = new Map()
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000 // Cache for 30 Days

app.get("/e/*", async (req, res, next) => {
  if (cache.has(req.path)) {
    const { data, contentType, timestamp } = cache.get(req.path)
    if (Date.now() - timestamp > CACHE_TTL) {
      cache.delete(req.path)
    } else {
      res.writeHead(200, { "Content-Type": contentType })
      return res.end(data)
    }
  }

  try {
    const baseUrls = {
      "/e/1/": "https://raw.githubusercontent.com/v-5x/x/fixy/",
      "/e/2/": "https://raw.githubusercontent.com/ypxa/y/main/",
      "/e/3/": "https://raw.githubusercontent.com/ypxa/w/master/",
    }

    let reqTarget
    for (const [prefix, baseUrl] of Object.entries(baseUrls)) {
      if (req.path.startsWith(prefix)) {
        reqTarget = baseUrl + req.path.slice(prefix.length)
        break
      }
    }

    if (!reqTarget) {
      return next()
    }

    const asset = await fetch(reqTarget)
    if (asset.status !== 200) {
      return next()
    }

    const data = Buffer.from(await asset.arrayBuffer())
    const ext = path.extname(reqTarget)
    const no = [".unityweb"]
    const contentType = no.includes(ext) ? "application/octet-stream" : mime.getType(ext)

    cache.set(req.path, { data, contentType, timestamp: Date.now() })
    res.writeHead(200, { "Content-Type": contentType })
    res.end(data)
  } catch (error) {
    console.error(error)
    res.setHeader("Content-Type", "text/html")
    res.status(500).send("Error fetching the asset")
  }
})

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "static")))
app.use("/ov", cors({ origin: true }))

var waiting = []
app.get('/waiting', (req, res) => {
  res.send(waiting);
})

function isKeyInDict(key, dict) {
  if (typeof dict !== 'object' || dict === null) {
      return false;
  }
  if (key in dict) {
      return true;
  }
  for (const k in dict) {
      if (dict.hasOwnProperty(k) && isKeyInDict(key, dict[k])) {
          return true;
      }
  }
  return false;
}


app.post('/verified', (req, res) => {
  var options = {
    method: 'GET',
    url: 'https://api.jsonbin.io/v3/b/666356cead19ca34f875bc4d',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': '$2a$10$6BysE.FjRL4.6NTAj0f/NeEo/rgbrxRsG0nimym.HRclykKDcDwm.'
    }
  };
  
  axios.request(options).then(function (response) {
    res.send(isKeyInDict(req.body.name, response.data.record.tree));
  }).catch(function (error) {
    console.error(error);
    res.send(false)
  });
})

app.post('/verify-user', (req, res) => {
  if (waiting.includes(req.body.name)) {
    const index = waiting.indexOf(req.body.name);
    if (index > -1) {
      waiting.splice(index, 1);
    }
  }
  res.sendStatus(200)
})

app.post('/verify', (req, res) => {
  if (waiting.includes(req.body.name)) {
    res.send({"status": "active"})
  } else if (req.body.first) {
    res.send({"status": "added"})
    waiting.push(req.body.name)
  } else {
    res.send({"status": "verified"})
  }
})

const routes = [
  { path: "/gm", file: "games.html" },
  { path: "/st", file: "settings.html" },
  { path: "/ta", file: "tabs.html" },
  { path: "/vu", file: "verify-user.html" },
  { path: "/ob", file: "onboard.html" },
  { path: "/", file: "index.html" },
]

routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, "static", route.file))
  })
})

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "static", "404.html"))
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).sendFile(path.join(__dirname, "static", "404.html"))
})

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res)
  } else {
    app(req, res)
  }
})

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head)
  } else {
    socket.end()
  }
})

server.on("listening", () => {
  console.log(`Running at http://localhost:${PORT}`)
})

server.listen({ port: PORT })