import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';
const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  res.send(patientService.getNonSensitiveEntry(req.params.id));
});

router.post('/', (req, res) => {
  try {
    const newEntry = toNewPatientEntry(req.body);

    const addedEntry = patientService.addEntry(newEntry);
    res.json(addedEntry);
    
  } catch (e) {
    res.status(400).send(e.message); //eslint-disable-line
  }
});

export default router;