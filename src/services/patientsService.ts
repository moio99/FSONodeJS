import patientsData from '../data/patients.ts'
import { Patient, NomSSNPatient, NewPatientEntry, Gender } from '../types.ts';
import { v1 as uuid } from 'uuid'

const patients: Patient[] = patientsData.map((patient) => ({
  ...patient,
  gender: patient.gender as Gender,
}));

const getEntries = () => {
  return patients;
};

const getPatientsWithoutSSN = (): NomSSNPatient[] => {
  return patientsData.map((patient) => ({
    id: patient.id,
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender as Gender,
    occupation: patient.occupation,
  }));
};

const findById = (id: string): NomSSNPatient | undefined => {
  const patient = getPatientsWithoutSSN().find(p => p.id === id);
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
  getPatientsWithoutSSN,
  findById,
  addEntry
};