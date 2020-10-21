import React from 'react';
import CountryView from './CountryView';

const CountryListItem = ({countryName, handler}) => {
  return (
    <div>
      <label>{countryName}
        <button onClick={handler}>Show</button>
      </label>
    </div>
  )
}
const CountryList = ({filterer, countries, showHandler}) => {
  //Applying the filter
  const filtered = countries.filter(filterer);


  //Display logic
  if (filtered.length > 10) {
    return (
      <div>
        <p>Too many matches</p>
      </div>
    )
  } else if (filtered.length > 1) {
    return (
      <div>
        {filtered.map(country => {
          return (
            <CountryListItem countryName={country.name} 
              handler={()=>showHandler(country.name)} key={country.name} />
          )
        })}
      </div>
    )
  } else if (filtered.length === 1) {
    return (
      <div>
        <CountryView country={filtered[0]} />
      </div>
    )
  } else {
    return <div></div>
  }
}

export default CountryList;