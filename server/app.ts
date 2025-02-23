import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import helmet from 'helmet'
import express from 'express'
import router from './router/router'
import compression from 'compression'
import { Borgen, Logger } from 'borgen'
import { Config } from './utils/config'
import cookieParser from 'cookie-parser'
import connectDb from './database/connectDb'
import { setupWebSocketServer } from './sockets'

const app = express()

const server = http.createServer(app)
export const wss = setupWebSocketServer(server)

// Middleware
app.use(
  cors({
    origin: [Config.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.use(helmet())
app.use(Borgen({}))
app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/', router)

const startServer = async () => {
  server.listen(Config.SERVER_PORT, () => {
    Logger.info({
      message: `Server is listening on port ${Config.SERVER_PORT}`,
      messageColor: 'greenBright',
      infoColor: 'whiteBright',
    })
  })
}

// Connect to the database. Then Start Server
connectDb(startServer)
