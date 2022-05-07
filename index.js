const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const redis = require('redis')
const cors = require('cors')
let RedisStore = require('connect-redis')(session)

const { MONGO_IP, MONGO_PORT, MONGO_USER, MONGO_PASSWORD, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config')

let redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        port: REDIS_PORT,
        host: REDIS_URL
    }
})

redisClient.connect().catch(console.error)

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')
const app = express()


const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('successfully connected to DB'))
        .catch(err => {
            console.log(err)
            setTimeout(connectWithRetry, 5000)
        })
}

connectWithRetry()
app.enable("trust proxy")
app.use(cors({}))
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 60000
    }
}))
app.use(express.json())
app.get('/api/v1', (req, res) => {
    res.send('<h2>Hi there: facu!</h2>')
})

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)
const port = process.env.PORT || 3000

redisClient.on('error', function (err) {
    console.log(err)
});

redisClient.on('connect', () => {
    console.log('💃 connected redis successfully 💃');
});

app.listen(port, () => console.log(`listening on port ${port}`))