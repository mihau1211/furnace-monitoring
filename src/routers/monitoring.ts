import express from 'express';

const router = express.Router();

router.get('/test', async (req: any, res: any) => {
    res.send('test');
});

export default router;