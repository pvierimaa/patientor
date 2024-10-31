import { useState } from 'react';
import { Button, TextField, MenuItem, Alert } from '@mui/material';
import { Diagnosis } from '../../types';
import patientService from '../../services/patients';
import axios from 'axios';

interface EntryFormProps {
  patientId: string;
  onEntryAdded: () => void;
  diagnoses?: Diagnosis[];
}

const EntryForm = ({ patientId, onEntryAdded, diagnoses = [] }: EntryFormProps) => {
  const [entryType, setEntryType] = useState('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<number | ''>('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [discharge, setDischarge] = useState({ date: '', criteria: '' });
  const [employerName, setEmployerName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const newEntry = {
      type: entryType,
      description,
      date,
      specialist,
      healthCheckRating: entryType === 'HealthCheck' ? healthCheckRating : undefined,
      discharge: entryType === 'Hospital' ? discharge : undefined,
      employerName: entryType === 'OccupationalHealthcare' ? employerName : undefined,
      diagnosisCodes,
    };

    try {
      await patientService.addEntry(patientId, newEntry);
      onEntryAdded();

      setDescription('');
      setDate('');
      setSpecialist('');
      setHealthCheckRating('');
      setDiagnosisCodes([]);
      setDischarge({ date: '', criteria: '' });
      setEmployerName('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data?.message || 'An error occurred. Please try again.';
        setErrorMessage(errorData);
        console.error('Axios Error Response:', error.response);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        console.error('Unexpected Error:', error);
      }
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <TextField
        select
        label="Entry Type"
        value={entryType}
        onChange={(e) => setEntryType(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="HealthCheck">Health Check</MenuItem>
        <MenuItem value="Hospital">Hospital</MenuItem>
        <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
      </TextField>
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Specialist"
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      {entryType === 'HealthCheck' && (
        <TextField
          label="Health Check Rating"
          type="number"
          value={healthCheckRating}
          onChange={(e) => setHealthCheckRating(Number(e.target.value))}
          required
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 3 }}
        />
      )}
      {entryType === 'Hospital' && (
        <>
          <TextField
            label="Discharge Date"
            type="date"
            value={discharge.date}
            onChange={(e) => setDischarge({ ...discharge, date: e.target.value })}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Discharge Criteria"
            value={discharge.criteria}
            onChange={(e) => setDischarge({ ...discharge, criteria: e.target.value })}
            required
            fullWidth
            margin="normal"
          />
        </>
      )}
      {entryType === 'OccupationalHealthcare' && (
        <TextField
          label="Employer Name"
          value={employerName}
          onChange={(e) => setEmployerName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
      )}
      <TextField
        select
        label="Diagnosis Codes"
        value={diagnosisCodes}
        onChange={(e) => setDiagnosisCodes(Array.isArray(e.target.value) ? e.target.value : [])}
        fullWidth
        margin="normal"
        SelectProps={{
          multiple: true,
        }}
      >
        {diagnoses.map((diagnosis) => (
          <MenuItem key={diagnosis.code} value={diagnosis.code}>
            {diagnosis.code} - {diagnosis.name}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Add Entry
      </Button>
    </form>
  );
};

export default EntryForm;
