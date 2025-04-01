import diagnosesData from '../data/diagnoses.ts'
import { Diagnosis } from '../types';

const diagnosis: Diagnosis[] = diagnosesData;
const getEntries = () => {
  return diagnosis;
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};