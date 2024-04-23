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

export default router;