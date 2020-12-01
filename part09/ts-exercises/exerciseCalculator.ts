type Rating = 1 | 2 | 3;

interface Results {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

export interface ExerciseValues {
  daily_exercises: Array<number>;
  target: number;
}

const calculateExercises = (days: Array<number>, target: number): Results => {
  const average: number = days.reduce((acc, val) => acc + val) / days.length;
  const difference: number = average - target;
  const descriptions: Array<string> = ['Poor', 'Good', 'Great'];
  const trainingDays: number = days.filter(d => d !== 0).length;

  let rating: Rating;

  if (difference > 0)
    rating = 3;
  else if (difference <= 0 && difference > (target / 4) * -1)
    rating = 2;
  else
    rating = 1;

  return {
    periodLength: days.length,
    trainingDays: trainingDays,
    success: (difference >= 0),
    rating: rating,
    ratingDescription: descriptions[rating-1],
    target: target,
    average: average
  };
};

const processArgs = (args: Array<string>): ExerciseValues => {
  if (args.length < 4)
    throw new Error('Not enough arguments');

  for (let i = 2; i < args.length; i++)
    if (isNaN(Number(args[i])))
      throw new Error('Non number argument detected');
  
  return {
    daily_exercises: args.filter((_val, index) => index > 2).map(val => Number(val)),
    target: Number(args[2])
  };
};

try {
  const { daily_exercises, target } = processArgs(process.argv);
  console.log(calculateExercises(daily_exercises, target));
} catch (e) {
  //eslint-disable-next-line
  console.log('Error: ', e.message);
}

export default calculateExercises;