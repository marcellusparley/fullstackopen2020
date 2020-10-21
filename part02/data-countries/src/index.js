/* in ./components:
App.js is the top component, it gathers the country data.
Filter.js is the Filter jsx for searching countries.
CountryList.js displays the country list and the main selected country 
  information via the CountryView component.
CountryView.js has both the CountryView and Weather components and is 
  responsible for fetching and displaying the weather data
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
