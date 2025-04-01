import patientsData from '../data/patients.ts'
import { Patient, NomSSNPatient, NewPatientEntry } from '../types.ts';
import { v1 as uuid } from 'uuid'

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

const findById = (id: string): NomSSNPatient | undefined => {
  const patient = getNomSSNPatient().find(p => p.id === id);
  return patient;
}

const addEntry = ( entry: NewPatientEntry ): Patient => {
  const newDiaryEntry = {
    id: uuid(),
    ...entry
  };

  patientsData.push(newDiaryEntry);
  return newDiaryEntry;
};

export default {
  getEntries,
  getNomSSNPatient,
  findById,
  addEntry
};