import express from 'express';
import cors from 'cors';
import diognosesRouter from './routes/diognoses';
import patientsRouter from './routes/patients';
const app = express();
app.use(express.json());
app.use(cors()); //eslint-disable-line

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diognosesRouter);
app.use('/api/patients', patientsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});