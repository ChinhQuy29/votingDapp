import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import { PORT, mongoDBURL } from './config.js'
import contractRoutes from './routes/contractRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app= express();

const corsOption= {
    origin: "http://localhost:5173",
    credentials: true,
}

app.use(express.json());
app.use(cors(corsOption));

app.use('/api/contract', contractRoutes);
app.use('/api/user', userRoutes);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log("Listening on port: ", PORT);
        })
    })
    .catch((error) => {
        console.error(error);
    })


