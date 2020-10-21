import React, {useState, useEffect} from 'react';
import axios from 'axios';

// This component is for displaying all the information about the country
const CountryView = ({ country }) => {
  const [weatherData, setWeather] = useState(null);

  //Function to fetch the data from the weather api
  const getWeather = () => {
    console.log(country);
    const url = 'http://api.openweathermap.org/data/2.5/weather?';
    //environment variable set up during npm start
    const api_key = process.env.REACT_APP_API_KEY; 
    const city = country.capital;
    const ccode = country.alpha2Code;

    axios
      .get(`${url}q=${city},${ccode}&appid=${api_key}&units=metric`)
      .then(response => {
        console.log(response.data);
        setWeather(response.data);
      });
  }

  useEffect(getWeather, []);
  console.log(weatherData);

  //Check to ensure weather data exists before trying to display it
  //If it's undefined like it would be on first render it shows a loading message
  let weatherElement = <p>(Loading Weather)</p>
  if (weatherData)
    weatherElement = (
      <WeatherDetails
        temp={weatherData.main.temp}
        icon={weatherData.weather[0].icon}
        desc={weatherData.weather[0].description}
        wind={weatherData.wind.speed}
        city={country.capital}
      />
    );

  return (
    <div>
      <h1>{country.name}</h1>
      <p><b>Capital:</b> {country.capital}</p>
      <p><b>Population:</b> {country.population}</p>
      <h2>Languages:</h2>
      <ul>
        {country.languages.map(lang => <li key={lang.name}>{lang.name}</li>)}
      </ul>
      <img src={country.flag} width="400" alt={country.name + " flag"} />
      {weatherElement}
    </div>
  )
}

const WeatherDetails = ({temp, desc, wind, icon, city}) => {
  return (
    <div>
      <h2>Weather in {city}:</h2>
        <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="weather icon" /> 
        <p><b>Currently:</b> {desc}</p>
        <p><b>Temperature</b> is {temp} C</p>
        <p><b>Wind speed</b> is {wind} m/s</p>
    </div>
  )
}

export default CountryView;