import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser';

const app = express();

// express middlewares
app.use(cors());
app.use(morgan('dev'))
app.use(fileUpload({
    useTempFiles: true,
}))
app.use(express.json());
app.use(cookieParser());

app.get('/test', (req, res) => {
    res.send('Welcome');
})


// routes
app.get('/', (req, res) => {
    res.send('test routes');
})
// app.use('/api/v1/auth' , authRouter)

// error middleware
// app.use(errorMiddleware)

export { app }