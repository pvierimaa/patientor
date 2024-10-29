import { Typography, Box } from '@mui/material';
import { HealthAndSafety, LocalHospital, Work } from '@mui/icons-material';
import { Entry, Diagnosis } from '../../types';

const findDiagnosisName = (code: string, diagnoses: Diagnosis[]): string | undefined => {
  const diagnosis = diagnoses.find((d) => d.code === code);
  return diagnosis ? diagnosis.name : undefined;
};

interface EntryDetailProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryDetails: React.FC<EntryDetailProps> = ({ entry, diagnoses }) => {
  const renderEntryDetails = () => {
    switch (entry.type) {
      case 'Hospital':
        return (
          <Box sx={commonStyles}>
            <Typography>{entry.date}</Typography>
            <Typography>
              Hospital Entry <LocalHospital />
            </Typography>
            <Typography>{entry.description}</Typography>
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
              <div>
                <ul>
                  {entry.diagnosisCodes.map((code) => (
                    <li key={code}>
                      <Typography>
                        {code} {findDiagnosisName(code, diagnoses)}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Typography>Specialist: {entry.specialist}</Typography>
            <Typography>Discharge date: {entry.discharge.date}</Typography>
            <Typography>Discharge criteria: {entry.discharge.criteria}</Typography>
          </Box>
        );

      case 'OccupationalHealthcare':
        return (
          <Box sx={commonStyles}>
            <Typography>{entry.date}</Typography>
            <Typography>
              Occupational Healthcare Entry <Work />
            </Typography>
            <Typography>{entry.description}</Typography>
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
              <div>
                <ul>
                  {entry.diagnosisCodes.map((code) => (
                    <li key={code}>
                      <Typography>
                        {code} {findDiagnosisName(code, diagnoses)}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Typography>Specialist: {entry.specialist}</Typography>
            <Typography>Employer: {entry.employerName}</Typography>
            {entry.sickLeave && (
              <div>
                <Typography>Sick leave start: {entry.sickLeave.startDate}</Typography>
                <Typography>Sick leave end: {entry.sickLeave.endDate}</Typography>
              </div>
            )}
          </Box>
        );

      case 'HealthCheck':
        return (
          <Box sx={commonStyles}>
            <Typography>{entry.date}</Typography>
            <Typography>
              Health Check Entry <HealthAndSafety />{' '}
            </Typography>
            <Typography>{entry.description}</Typography>
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
              <div>
                <ul>
                  {entry.diagnosisCodes.map((code) => (
                    <li key={code}>
                      <Typography>
                        {code} {findDiagnosisName(code, diagnoses)}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Typography>Specialist: {entry.specialist}</Typography>
            <Typography>Health check rating: {entry.healthCheckRating}</Typography>
          </Box>
        );

      default:
        return <Typography>Unknown Entry Type</Typography>;
    }
  };

  return <div>{renderEntryDetails()}</div>;
};

const commonStyles = {
  border: '1px solid #3f51b5',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
  backgroundColor: '#f5f5f5',
};

export default EntryDetails;
