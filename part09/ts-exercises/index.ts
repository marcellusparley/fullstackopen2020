import express from 'express';
import * as bmi from './bmiCalculator';
import calculateExercises, { ExerciseValues } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_request, response) => {
  response.send('Hello World!');
});

app.get('/bmi', (request, response) => {
  if (isNaN(Number(request.query.height)) || isNaN(Number(request.query.weight)))
    return response.status(400).json({ error: 'Malformatted parameters' });

  const weight = Number(request.query.weight);
  const height = Number(request.query.height);
  const ret = {
    weight,
    height,
    bmi: bmi.calculateBmi(height, weight)
  };

  return response.json(ret);
});

app.post('/exercise', (request, response) => {
  const body = request.body as ExerciseValues;

  if (!body)
    return response.status(400).json({ error: 'no body' });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!body.daily_exercises || !body.target)
    return response.status(400).json({ error: 'parameters missing' });

  for (let i = 0; i < body.daily_exercises.length; i++)
    if (isNaN(body.daily_exercises[i]))
      return response.status(400).json({ error: 'malformatted parameters' });

  const ret = calculateExercises(body.daily_exercises, body.target);
  return response.json(ret);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});