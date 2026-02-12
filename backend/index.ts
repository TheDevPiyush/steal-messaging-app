import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json())

app.get('/', (_, res: Response) => {
    res.send({ "message": "OK" });
});

app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});
