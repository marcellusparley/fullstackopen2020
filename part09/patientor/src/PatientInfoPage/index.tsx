import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useStateValue, updatePatient } from "../state";
import { Patient, Diagnosis, Entry } from "../types";
import { apiBaseUrl } from "../constants";

const HospitalEntry: React.FC<{ entry: Entry; diagnoses: Map<string, string> }> = ({ entry, diagnoses }) => {
  return (
    <div>
      <h4>{entry.date}</h4>
      <i className="huge hospital icon" />
      <p>{entry.description}</p>  
      {entry.diagnosisCodes && <ul>
        {entry.diagnosisCodes.map(d =>
          <li key={d}>{d} : {diagnoses && diagnoses.get(d)}</li>
        )}
      </ul>
      }
    </div>
  );
};

const OccupationalHealthcareEntry: React.FC<{ entry: Entry; diagnoses: Map<string, string> }> = ({ entry, diagnoses }) => {
  return (
    <div>
      <h4>{entry.date}</h4>
      <i className="huge fax icon" />
      <p>{entry.description}</p>  
      {entry.diagnosisCodes && <ul>
        {entry.diagnosisCodes.map(d =>
          <li key={d}>{d} : {diagnoses && diagnoses.get(d)}</li>
        )}
      </ul>
      }
    </div>
  );
};

const HealthCheckEntry: React.FC<{ entry: Entry; diagnoses: Map<string, string> }> = ({ entry, diagnoses }) => {
  return (
    <div>
      <h4>{entry.date}</h4>
      <i className="huge medkit icon" />
      <p>{entry.description}</p>  
      {entry.diagnosisCodes && <ul>
        {entry.diagnosisCodes.map(d =>
          <li key={d}>{d} : {diagnoses && diagnoses.get(d)}</li>
        )}
      </ul>
      }
    </div>
  );
};

const EntryDetails: React.FC<{ entry: Entry; diagnoses: Map<string,string> }> = (props) => {
  switch (props.entry.type) {
    case "Hospital":
      return <HospitalEntry {...props} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry {...props} />;
    case "HealthCheck":
      return <HealthCheckEntry {...props} />;
    default:
      return null;
  }
};

const PatientInfoPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [diagnoses, setDiagnoses] = useState<Map<string, string>>();
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams<{ id: string }>();

  const getPatientInfo = async (id: string) => {
    try {
      const { data: newPatient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
      dispatch(updatePatient(newPatient));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setPatient(Object.values(patients).find(p => p.id === id));

    if (patient && !patient.entries){
      getPatientInfo(id);
      setPatient(Object.values(patients).find(p => p.id === id));
    }

    axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`)
      .then( result => {
        const diagnosesMap = new Map(result.data.map((d): [string, string] => [d.code, d.name]));
        setDiagnoses(diagnosesMap);
      })
      .catch( err => {
        console.log(err.message);
      });
  });

  if (!patient)
    return null;

  return (
    <div>
      <h3>{patient.name}</h3>
      <p>{patient.gender}</p>
      <p>{patient.occupation}</p>

      <h4>Entries</h4>
      {diagnoses && patient.entries.map(e => 
        <EntryDetails key={e.id} entry={e} diagnoses={diagnoses} />
      )}
    </div>
  );
};

export default PatientInfoPage;