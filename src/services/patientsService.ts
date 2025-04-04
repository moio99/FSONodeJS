import patientsData from '../data/patients.ts'
import { Patient, NonSensitivePatient, NewPatientEntry, Gender } from '../types.ts';
import { v1 as uuid } from 'uuid'

const patients: Patient[] = patientsData.map((patient) => ({
  ...patient,
  gender: patient.gender as Gender,
  entries: [],
}));

const getEntries = () => {
  return patients;
};

const getPatientsWithoutSSN = (): NonSensitivePatient[] => {
  return patientsData.map((patient) => ({
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender as Gender,
    occupation: patient.occupation,
    entries: [],
    id: patient.id,
  }));
};

const findById = (id: string): Patient | undefined => {
  const patient = patientsData.find(p => p.id === id);
  console.log(patient);
  return patient ? { ...patient, gender: patient.gender as Gender, entries: [] } : undefined;
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