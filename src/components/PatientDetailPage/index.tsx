import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import axios from 'axios';
import { Male, Female, Transgender } from '@mui/icons-material';

import { Patient } from '../../types';
import { apiBaseUrl } from '../../constants';

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: fetchedPatient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        setPatient(fetchedPatient);
      } catch (error) {
        console.error('Failed to fetch patient data', error);
      }
    };

    if (id) void fetchPatient();
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
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
    </div>
  );
};

export default PatientDetailPage;
