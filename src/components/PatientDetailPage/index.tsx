import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Male, Female, Transgender } from '@mui/icons-material';

import { Patient, Diagnosis } from '../../types';
import patientService from '../../services/patients';
import EntryDetails from './EntryDetails';

interface Props {
  diagnoses: Diagnosis[];
}

const PatientDetailPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (id) {
          const patient = await patientService.getById(id);
          setPatient(patient);
        }
      } catch (error) {
        console.error('Failed to fetch patient data', error);
      }
    };

    fetchPatient();
  }, [id]);

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
