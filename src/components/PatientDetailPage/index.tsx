import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Male, Female, Transgender } from '@mui/icons-material';

import { Patient, Diagnosis } from '../../types';
import patientService from '../../services/patients';

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

  const findDiagnosisName = (code: string): string | undefined => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : undefined;
  };

  return (
    <div>
      <Typography variant="h4" style={{ marginTop: '16px', marginBottom: '8px' }}>
        {patient.name} {getGenderIcon()}
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography variant="h5" style={{ marginTop: '16px', marginBottom: '8px' }}>
        entries
      </Typography>
      {patient.entries.length > 0 ? (
        patient.entries.map((entry) => (
          <div key={entry.id}>
            <Typography>
              {entry.date} <i>{entry.description}</i>
            </Typography>
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
              <div>
                <ul>
                  {entry.diagnosisCodes.map((code) => (
                    <li key={code}>
                      <Typography>
                        {code} {findDiagnosisName(code)}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <Typography>No entries available</Typography>
      )}
    </div>
  );
};

export default PatientDetailPage;
