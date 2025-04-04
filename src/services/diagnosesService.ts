import diagnosesData from '../data/diagnoses.ts'
import { Diagnosis } from '../types';

const diagnosis: Diagnosis[] = diagnosesData;
const getEntries = () => {
  return diagnosis;
};

const getDiagnosis = (code: string): Diagnosis | undefined => {
  const element = diagnosis.find(d => d.code === code);
  return element;
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  getDiagnosis,
  addEntry
};