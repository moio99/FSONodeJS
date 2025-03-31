interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (dailyExercises: number[], target: number) => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter(day => day > 0).length;
  const totalHours = dailyExercises.reduce((sum, day) => sum + day, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'very good, you are doing great';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'bad you needs improvement';
  }

  let result: ExerciseResult = {
    periodLength,
    trainingDays,
    target,
    average,
    success,
    rating,
    ratingDescription
  };
  return result;
};

try {
  if (process.argv.length < 4) throw new Error('Not enough arguments');
  if (process.argv.length > 4) throw new Error('Too many arguments');
  if (!isNaN(Number(process.argv[3]))) {
    const args = process.argv.slice(2);
    const dailyExercises = JSON.parse(args[0]);
    const target = Number(args[1]);
    const result = calculateExercises(dailyExercises, target);
    console.log(result);
  } else {
    throw new Error('Provided target value was not number!');
  }
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
