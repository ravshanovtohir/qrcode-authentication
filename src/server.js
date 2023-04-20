import "./config/config.js"
import express from 'express'
import fs from "fs"
import database from "./config/database.js"

const PORT = process.env.PORT || 3001
const app = express()

//middlewares
app.use(express.json())

app.get('/', (req, res) => res.send("Hello"))

// routes
import authRouter from './routes/auth.js'
import qrRouter from './routes/QR.js'


!async function () {
    try {
        database()
        app.use(authRouter)
        app.use(qrRouter)
    } catch (error) {
        console.log(error)
    }
    app.use((error, req, res, next) => {

        fs.appendFileSync('./log.txt', `${req.url}__${req.method}__${Date.now()}__${error.name}__${error.message}\n`)

        if (error.name == 'ValidationError') {
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                errorName: error.name,
                error: true,
            })
        }


        if (error.status != 500) {
            error.status = error.status ? error.status : 404
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                errorName: error.name,
                error: true,
            })
        }


        return res.status(error.status).json({
            status: error.status,
            message: 'Internal Server Error',
            errorName: error.name,
            error: true,
        })
    })
    app.listen(PORT, () => console.log("🚀 BackEnd server is running http://localhost:" + PORT))
}()