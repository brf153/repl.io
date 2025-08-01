import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express!');
});

// Add more routes here

export default router;