import express from 'express';
import { Request, Response } from "express";
import { MonitoringDataService } from "../models/services/monitoringData.service";

const router = express.Router();

const monitoringDataService = new MonitoringDataService();

router.post('/monitoringData', async (req: Request, res: Response) => {
    try {
        if (!req.body.timestamp) {
            req.body.timestamp = new Date();
        }
        await monitoringDataService.saveMonitoringData(req.body);
        res.status(201).send('Created');
    } catch (err: any) {
        res.status(400).send({ error: err.message });
    }
});

router.get('/monitoringData/furnace/:furnace', async (req: Request, res: Response) => {
    try {
        const monitoringData = await monitoringDataService.findMonitoringDataByFurnace(req.params.furnace);
        res.status(201).send({ monitoringData });
    } catch (err: any) {
        res.status(404).send({ error: err.message });
    }
});

export default router;