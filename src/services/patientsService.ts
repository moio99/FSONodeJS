import patientsData from '../data/patients.ts'
import { Patient, NonSensitivePatient, NewPatient, Gender, NewEntry, Entry } from '../types.ts';
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
  if (!patient) return undefined;

  return patient
};

const addPatient = ( entry: NewPatient ): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };
  
  patientsData.push(newPatient);
  return newPatient;
};

const addEntry = ( id: string, entry: NewEntry ): Entry => {
  const newEntry = {
    id: uuid(),
    ...entry
  } as Entry;

  const patient = patientsData.find(p => p.id === id);
  if (!patient) throw new Error('Patient not found');

  patient.entries.push(newEntry);
    
  return newEntry;
};

export default {
  getEntries,
  getPatientsWithoutSSN,
  findById,
  addPatient,
  addEntry
};