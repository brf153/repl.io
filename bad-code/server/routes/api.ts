import express from 'express';
import { setupCode } from '../controllers/aws.js';

const router = express.Router();

router.post('/create-repl', setupCode);

// Add more routes here

export default router;