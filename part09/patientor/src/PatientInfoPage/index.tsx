import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useStateValue, updatePatient } from "../state";
import { Patient } from "../types";
import { apiBaseUrl } from "../constants";

const PatientInfoPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
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
    if (!patients[id].entries){
      getPatientInfo(id);
    }
  });

  return (
    <div>
      <h3>{patients[id].name}</h3>
      <p>{patients[id].gender}</p>
      <p>{patients[id].occupation}</p>
    </div>
  );
};

export default PatientInfoPage;