import express from 'express';
import { Request, Response } from "express";
import { MonitoringDataService } from "../models/services/monitoringData.service";
import { MonitoringDataInterface } from '../models/MonitoringData';

const router = express.Router();

const monitoringDataService = new MonitoringDataService();

router.post('/monitoringData', async (req: Request, res: Response) => {
    try {
        await monitoringDataService.saveMonitoringData(req.body);
        res.status(201).send('Created');
    } catch (err: any) {
        res.status(400).send({ error: err.message });
    }
});

router.post('/monitoringData/buffer', async (req: Request, res: Response) => {
    try {
        const records: MonitoringDataInterface[] = req.body;
        for (const record of records) {
            await monitoringDataService.saveMonitoringData(record);
        }
        res.status(201).send('Created');
    } catch (err: any) {
        res.status(400).send({ error: err.message });
    }
});

router.get('/monitoringData/furnace/:furnaceId', async (req: Request, res: Response) => {
    try {
        const furnaceId = Number(req.params.furnaceId);
        const { range, from, to } = req.query;

        let startDateFilter: Date | boolean = from ? new Date(Number(from)) : false;
        let endDateFilter: Date | boolean = to ? new Date(Number(to)) : false;

        if (range) {
            switch (range) {
                case 'day':
                    startDateFilter = new Date();
                    startDateFilter.setHours(0);
                    startDateFilter.setMinutes(0);
                    startDateFilter.setSeconds(0);
                    startDateFilter.setMilliseconds(0);

                    endDateFilter = new Date();
                    break;
                case 'week':
                    startDateFilter = new Date();
                    startDateFilter.setDate(startDateFilter.getDate() - 6);
                    startDateFilter.setHours(0);
                    startDateFilter.setMinutes(0);
                    startDateFilter.setSeconds(0);
                    startDateFilter.setMilliseconds(0);

                    endDateFilter = new Date();
                    break;
                case 'month':
                    startDateFilter = new Date();
                    startDateFilter.setDate(startDateFilter.getDate() - 30);
                    startDateFilter.setHours(0);
                    startDateFilter.setMinutes(0);
                    startDateFilter.setSeconds(0);
                    startDateFilter.setMilliseconds(0);

                    endDateFilter = new Date();
                    break;
            }
        }

        const monitoringData = await monitoringDataService.findMonitoringDataByFurnace(furnaceId, startDateFilter, endDateFilter);
        res.status(201).send({ data: monitoringData });
    } catch (err: any) {
        res.status(404).send({ error: err.message });
    }
});

router.get('/monitoringData/furnace/avg/:furnaceId', async (req: Request, res: Response) => {
    try {
        const furnaceId = Number(req.params.furnaceId);
        const { minutes } = req.query;

        const averageData = await monitoringDataService.findAverageForLastProvidedMinutesByFurnace(furnaceId, Number(minutes));
        res.status(200).send(averageData)
    } catch (err: any) {
        res.status(404).send({ error: err.message });
    }
});

export default router;