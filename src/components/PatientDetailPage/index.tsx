import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Male, Female, Transgender } from '@mui/icons-material';

import { Patient, Diagnosis } from '../../types';
import patientService from '../../services/patients';
import EntryDetails from './EntryDetails';
import EntryForm from './EntryForm';

interface Props {
  diagnoses: Diagnosis[];
}

const PatientDetailPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPatient = useCallback(async () => {
    try {
      if (id) {
        const patient = await patientService.getById(id);
        setPatient(patient);
      }
    } catch (error) {
      console.error('Failed to fetch patient data', error);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const handleEntryAdded = async () => {
    await fetchPatient();
  };

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  const getGenderIcon = () => {
    switch (patient.gender) {
      case 'male':
        return <Male />;
      case 'female':
        return <Female />;
      default:
        return <Transgender />;
    }
  };

  return (
    <div>
      <Typography variant="h4" style={{ marginTop: '16px', marginBottom: '8px' }}>
        {patient.name} {getGenderIcon()}
      </Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>

      <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
        Add Entry
      </Button>

      <Dialog open={isModalOpen}>
        <DialogTitle>Add Entry</DialogTitle>
        <DialogContent>
          {id && <EntryForm patientId={id} onEntryAdded={handleEntryAdded} diagnoses={diagnoses} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" style={{ marginTop: '16px', marginBottom: '8px' }}>
        Entries
      </Typography>
      {patient.entries.length > 0 ? (
        patient.entries.map((entry) => (
          <div key={entry.id}>
            <EntryDetails entry={entry} diagnoses={diagnoses} />
          </div>
        ))
      ) : (
        <Typography>No entries available</Typography>
      )}
    </div>
  );
};

export default PatientDetailPage;
