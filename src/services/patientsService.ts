import patientsData from '../data/patients.ts'
import { Patient, NomSSNPatient } from '../types.ts';

const patients: Patient[] = patientsData.map((patient) => ({
  ...patient,
  gender: patient.gender as "male" | "female",
}));

const getEntries = () => {
  return patients;
};

const getNomSSNPatient = (): NomSSNPatient[] => {
  return patientsData.map(({ id,
    name,
    dateOfBirth,
    gender,
    occupation, }) => ({id,
      name,
      dateOfBirth,
      gender: gender as "male" | "female",
      occupation,
  }));
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  getNomSSNPatient,
  addEntry
};