import diagnosesData from '../data/diagnoses.ts'
import { Diagnosis } from '../types';

const diagnosis: Diagnosis[] = diagnosesData;
const getAll = () => {
  return diagnosis.map(d => d.code);
};

const getDiagnosis = (code: string): Diagnosis | undefined => {
  const element = diagnosis.find(d => d.code === code);
  return element;
};

const addDiagnosis = (diagnosis: Diagnosis) => {
  diagnosesData.push(diagnosis);
  return null;
};

export default {
  getAll,
  getDiagnosis,
  addDiagnosis
};