import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CountryList from './CountryList';
import Filter from './Filter';

function App() {
  const [ newFilter, setNewFilter ] = useState('');
  const [countries, setCountries] = useState([]);

  //Get the list of countries
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data);
      })
  }, []);

  //updates filter state based on input element in Filter
  const handleFilterChange = (e) => {
    setNewFilter(e.target.value);
  }

  //updates filter to the selected country in the list
  const showHandler = (name) => {
    setNewFilter(name);
  }

  const filterer = (country) => {
    return country.name.toLowerCase().includes(newFilter.toLowerCase())
  }

  return (
    <div>
      <Filter handler={handleFilterChange} value={newFilter} />
      <CountryList filterer={filterer} countries={countries} showHandler={(showHandler)} />
    </div>
  );
}

export default App;