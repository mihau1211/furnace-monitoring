import express from "express";
import { Request, Response} from "express";
import { FurnaceService } from "../models/services/furnace.service";

const router = express.Router();

const furnaceService = new FurnaceService();

router.get('/furnace/:furnaceId', async (req: Request, res: Response) => {
    try {
        const furnaceId = Number(req.params.furnaceId);

        const furnace = await furnaceService.findFurnaceById(furnaceId);
        res.status(200).send({furnace});
    } catch (err: any) {
        res.status(404).send({ error: err.message })
    }
});

router.get('/furnace/owner/:ownerId', async (req: Request, res: Response) => {
    try {
        const ownerId = Number(req.params.ownerId);

        const furnaces = await furnaceService.findFurnacesByOwnerId(ownerId);
        res.status(200).send({furnaces});
    } catch (err: any) {
        res.status(404).send({ error: err.message })
    }
});

router.post('/furnace', async (req: Request, res: Response) => {
    try {
        await furnaceService.saveFurnace(req.body);
        res.status(201).send('Created');
    } catch (err: any) {
        res.status(404).send({ error: err.message })
    }
});

router.post('/furnace/minTemp/:furnaceId', async (req: Request, res: Response) => {
    try {
        const furnaceId = Number(req.params.furnaceId);

        await furnaceService.setTempLimitValue(furnaceId, 'minTemp', req.body.minTemp);
        res.status(200).send('Updated');
    } catch (err: any) {
        res.status(404).send({ error: err.message })
    }
});

router.post('/furnace/maxTemp/:furnaceId', async (req: Request, res: Response) => {
    try {
        const furnaceId = Number(req.params.furnaceId);

        await furnaceService.setTempLimitValue(furnaceId, 'maxTemp', req.body.maxTemp);
        res.status(200).send('Updated');
    } catch (err: any) {
        res.status(404).send({ error: err.message })
    }
});

router.post('/furnace/fanState/:furnaceId', async (req: Request, res: Response) => {
    try {
        const furnaceId = Number(req.params.furnaceId);

        await furnaceService.setFanState(furnaceId, req.body.state);
        res.status(200).send('Updated');
    } catch (err: any) {
        res.status(404).send({ error: err.message })
    }
});

export default router;