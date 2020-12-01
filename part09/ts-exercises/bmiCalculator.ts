export const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = weight / (( height / 100) * (height / 100));

  if (bmi < 15)
    return 'Very severely underweight';
  else if (bmi >= 15 && bmi < 16)
    return 'Severely underweight';
  else if (bmi >= 16 && bmi < 18.5)
    return 'Underweight';
  else if (bmi >= 18.5 && bmi < 25)
    return 'Normal (healthy weight)';
  else if (bmi >= 25 && bmi < 30)
    return 'Overweight';
  else if (bmi >= 30 && bmi < 35)
    return 'Obese Class I (Moderately obese)';
  else if (bmi >= 35 && bmi < 40)
    return 'Obese Class II (Severely obese)';
  else
    return 'Obese Class III (Very severely obese)';
};

interface BmiVals {
  height: number,
  weight: number
}

const parseArgs = (args: Array<string>): BmiVals => {
  if (args.length > 4 || args.length < 4)
    throw new Error('Needs exactly 2 arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3])))
    return { height: Number(args[2]), weight: Number(args[3]) };
  else
    throw new Error('Provided values were not nummbers');
};

try {
  const { height, weight } = parseArgs(process.argv);
  console.log(calculateBmi(height, weight));
} catch (e) {
  //eslint-disable-next-line
  console.log('Error: ', e.message);
}