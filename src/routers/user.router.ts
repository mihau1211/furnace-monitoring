import express from 'express';
import { Request, Response } from 'express';
import { UserService } from '../models/services/user.service';
import { UserInterface } from '../models/User';

const router = express.Router();

const userService = new UserService();

router.post('/user', async (req: Request, res: Response) => {
    try {
        await userService.saveUser(req.body);
        res.status(201).send('Created');
    } catch (err: any) {
        res.status(400).send({ error: err.message });
    }
});

router.post('/user/login', async (req: Request, res: Response) => {
    try {
        const user = await userService.login(req.body.imei, req.body.password);
        res.status(200).send({ user });
    } catch (err: any) {
        res.status(400).send({ error: err.message });
    }
});

export default router;