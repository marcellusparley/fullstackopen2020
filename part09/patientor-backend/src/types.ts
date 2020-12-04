export enum Gender {
  Male = 'male',
  Female = 'female'
}

//eslint-disable-next-line
export interface JournalEntry {
}

export interface DiagnosesEntry {
  code: string;
  name: string;
  latin?: string;
}

export interface PatientEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: JournalEntry[]
}

export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn'>;

export type PublicPatient = Omit<PatientEntry, 'ssn' | 'entries'>;

export type NewPatientEntry = Omit<PatientEntry, 'id'>;