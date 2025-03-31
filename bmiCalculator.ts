const calculateBmi = (estatura: number, masa: number) => {
  let imc = masa / (estatura * estatura);
  if (imc < 18.5) {
    console.log('Underweight');
  } else if (imc >= 18.5 && imc <= 24.9) {
    console.log('Normal (healthy weight)');
  } else if (imc >= 25 && imc <= 29.9) {
    console.log('Overweight');
  }
}

const args = process.argv.slice(2);
const masa = parseFloat(args[0]);
const estatura = parseFloat(args[1]);

calculateBmi(masa, estatura);