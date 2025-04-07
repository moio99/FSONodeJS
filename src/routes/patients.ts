import express from 'express';
import patientsService from '../services/patientsService';
import toNewPatient from '../utilsPatient';
import toNewEntry from '../utilsEntry';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getPatientsWithoutSSN());
})

router.get('/:id', (req, res) => {
  const patient = patientsService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
})

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedEntry = patientsService.addPatient(newPatient);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
})

router.post('/:id/entries', (req, res) => {
  try {
    if (!req.params.id) throw new Error('Missing id');
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientsService.addEntry(req.params.id, newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
})

export default router;