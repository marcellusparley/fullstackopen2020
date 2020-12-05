import patients from '../../data/patients';
import { PatientEntry, NonSensitivePatientEntry,
   NewPatientEntry, PublicPatient } from '../types';
import { v4 as uuidv4 } from 'uuid';

const getEntries = (): PatientEntry[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const getNonSensitiveEntry = (id: string): NonSensitivePatientEntry | undefined => {
  const pat = patients.find(p => p.id === id);

  if (pat) {
    const { ssn, ...patNonSens } = pat; //eslint-disable-line
    return patNonSens;
  } else {
    throw new Error('patient not found');
  }
};

const getPublicEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addEntry = (entry: NewPatientEntry): PatientEntry => {
  
  const id: string = uuidv4(); // eslint-disable-line
  
  const newPatientEntry = {
    id: id,
    entries: [],
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  getNonSensitiveEntry,
  getPublicEntries,
  addEntry
};