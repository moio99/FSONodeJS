export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: "male" | "female";
  occupation: string;
};

export type NomSSNPatient = Omit<Patient, 'ssn'>;