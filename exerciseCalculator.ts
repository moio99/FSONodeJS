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

  const result ={
    periodLength,
    trainingDays,
    target,
    average,
    success,
    rating,
    ratingDescription
  };
  console.log(result);
};

const args = process.argv.slice(2);
const dailyExercises = JSON.parse(args[0]);
const target = Number(args[1]);

calculateExercises(dailyExercises, target);