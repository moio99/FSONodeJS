const calculateBmi = (height: number, weight: number): string => {
  let imc = weight / (height * height / 10000);
  let result = '';
  if (imc < 18.5) {
    result = 'Underweight';
  } else if (imc >= 18.5 && imc <= 24.9) {
    result = 'Normal (healthy weight)';
  } else if (imc >= 25 && imc <= 29.9) {
    result = 'Overweight';
  }
  return result;
}

export default calculateBmi;