import express from 'express';
import cors from 'cors';
import monitoringRouter from './routers/monitoringData.router';
import { dbSource } from '../db/dbSource';

dbSource
    .initialize()
    .then(() => {
        console.log('Database is initialized.')
    })
    .catch((err) => {
        console.log('Error during Databsse initialization: ', err)
    })

const apiV1Prefix = '/api/v1/';

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiV1Prefix, monitoringRouter);

export default app;