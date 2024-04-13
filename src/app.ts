import express from 'express';
import cors from 'cors';
import monitoringRouter from './routers/monitoring';

// const apiV1Prefix = '/api/v1/';

const app = express();

app.use(cors());
app.use(express.json());
app.use(monitoringRouter);

export default app;