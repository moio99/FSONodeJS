import {
  NewEntry,
  HealthCheckRating,
  Diagnosis,
  Discharge,
  SickLeave,
} from './types';

const isString = (text: unknown): text is string =>
  typeof text === 'string' || text instanceof String;

const isDate = (date: string): boolean => Boolean(Date.parse(date));

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseString = (field: unknown, fieldName: string): string => {
  if (!isString(field)) {
    throw new Error(`Incorrect or missing ${fieldName}`);
  }
  return field;
};

const isArrayOfStrings = (arr: unknown): arr is string[] =>
  Array.isArray(arr) && arr.every(item => isString(item));

const parseDiagnosisCodes = (codes: unknown): Array<Diagnosis['code']> => {
  if (!codes) return [];
  if (!isArrayOfStrings(codes)) {
    throw new Error('Incorrect diagnosis codes');
  }
  return codes;
};

const parseDiagnosisDescriptions = (desc: unknown): string[] => {
  if (!desc) return [];
  if (!isArrayOfStrings(desc)) {
    throw new Error('Incorrect diagnosis descriptions');
  }
  return desc;
};

const isHealthCheckRating = (param: unknown): param is HealthCheckRating => {
  return typeof param === 'number' && param in HealthCheckRating;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing healthCheckRating');
  }
  return rating;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (
    !discharge ||
    typeof discharge !== 'object' ||
    !('date' in discharge) ||
    !('criteria' in discharge)
  ) {
    throw new Error('Incorrect or missing discharge');
  }

  return {
    date: parseDate(discharge.date),
    criteria: parseString(discharge.criteria, 'discharge.criteria')
  };
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (
    !sickLeave ||
    typeof sickLeave !== 'object' ||
    !('startDate' in sickLeave) ||
    !('endDate' in sickLeave)
  ) {
    throw new Error('Incorrect or missing sickLeave');
  }

  return {
    startDate: parseDate(sickLeave.startDate),
    endDate: parseDate(sickLeave.endDate)
  };
};

const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object' || !('type' in object)) {
    throw new Error('Invalid or missing entry type');
  }

  const baseEntry = {
    description: parseString((object as any).description, 'description'),
    date: parseDate((object as any).date),
    specialist: parseString((object as any).specialist, 'specialist'),
    diagnosisCodes: parseDiagnosisCodes((object as any).diagnosisCodes),
    diagnosisDescriptions: parseDiagnosisDescriptions((object as any).diagnosisDescriptions)
  };

  switch ((object as any).type) {
    case 'HealthCheck':
      return {
        ...baseEntry,
        type: 'HealthCheck',
        healthCheckRating: parseHealthCheckRating((object as any).healthCheckRating)
      } as NewEntry;
    case 'Hospital':
      return {
        ...baseEntry,
        type: 'Hospital',
        discharge: parseDischarge((object as any).discharge)
      } as NewEntry;
    case 'OccupationalHealthcare':
      return {
        ...baseEntry,
        type: 'OccupationalHealthcare',
        employerName: parseString((object as any).employerName, 'employerName'),
        sickLeave: parseSickLeave((object as any).sickLeave)
      } as NewEntry;
    default:
      throw new Error('Invalid entry type: ' + (object as any).type);
  }
};

export default toNewEntry;
