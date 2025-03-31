import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();
app.use(express.json());  

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  try {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);
    const bmi = calculateBmi(height, weight);
    res.json({ weight, height, bmi });
  } catch (error: unknown) {
    console.log(error);
    res.status(400).send({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  try {
    if (req.body) {
      const { daily_exercises, target } = req.body;
      if (!isNaN(Number(target))) {
        const result = calculateExercises(daily_exercises, target);
        res.json(result);
      } else {
        res.status(400).send({ error: 'malformatted parameters' });
      }
    } else {
      res.status(400).send({ error: 'parameters missing' });
    }
  } catch (error: unknown) {
    console.log(error);
    res.status(400).send({ error: 'malformatted parameters' });
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});