import diagnoses from '../../data/diagnoses';
import { DiagnosesEntry } from '../types';

const getEntries = (): DiagnosesEntry[] => {
  return diagnoses;
};

const addEntry = (): void => {
  //return null;
};

export default {
  getEntries,
  addEntry
};