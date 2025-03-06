import dotenv from 'dotenv';
dotenv.config()
import http from 'http'
import { app } from './app.js'
import { connectToDB } from './config/db.config.js';

const server = http.createServer(app)

connectToDB().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`server started at ${process.env.PORT}`);
    })
}).catch((error) => {
    console.log("Failed to connect database", error);
})