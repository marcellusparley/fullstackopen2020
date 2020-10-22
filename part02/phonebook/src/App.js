import axios from 'axios';
import React, {useEffect, useState} from 'react';
import numService from './services/numbers';
import Filter from './components/Filter';
import NumList from './components/NumList';
import AddNumber from './components/AddNumber';

/* App is the top component it handles the state and logic.
 * Filter is just the search form
 * NumList displays the filtered list of numbers with delete buttons
 * AddNumber is the form for adding or changing numbers
 * numService handles all the interaction with server
 */

const Notification = ({notification}) => {
  if (notification === null) {
    return null;
  }

  return (
    <div className={notification.type}>{notification.message}</div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ newFilter, setNewFilter ] = useState('');
  const [ notification, setNewNotification ] = useState(null);

  //Initial fetching of phonebook data from server
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
    });
  }, []);

  const handleNameChange = (e) => {
    //console.log(e.target.value);
    setNewName(e.target.value);
  }

  const handleFilterChange = (e) => {
    setNewFilter(e.target.value);
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  }

  const notify = (message, mtype) => {
    setNewNotification(
      {
        message: message,
        type: mtype
      }
    );

    setTimeout(() => {
      setNewNotification(null);
    }, 5000)
  }

  //Handler for add number button
  const addNumber = (e) => {
    e.preventDefault();
    const p = { name: newName, number: newNumber };
    const pin = persons.findIndex(p => p.name === newName);

    //Check if person's number is already in phonebook and asks
    //if user would like to update their number
    if ( pin !== -1) {
      const pid = persons[pin].id;
      if (window.confirm(`Would you like to update ${p.name}'s number?`)) {
        numService
          .updateNumber(pid, p)
          .then(returnedPerson => {
            setPersons(persons.map(per => per.id !== pid ? per : returnedPerson));
            setNewNumber('');
            setNewName('');
            notify(`Updated ${p.name}'s number`, 'success')
          })
          .catch(e => {
            //alert('Couldn\'t update number');
            notify(`Couldn't update ${p.name}'s number - not on server`, 'error');
            setPersons(persons.filter(p => p.id !== pid));
          })
      }
    } else {
      numService
        .createNumber(p)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          notify(`Added ${p.name}'s number`, 'success')
        });
    }
  }

  //Handler for delete button
  //Asks user if they are sure they want to delete
  const deleteHandler = (id, name) => {
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      numService 
        .deleteNumber(id)
        .then(res => {
          setPersons(persons.filter(p => p.id !== id));
          notify(`Deleted ${name}'s number`, 'success');
        })
        .catch(e => {
          //alert(`Unable to delete number for ${name}`);
          notify(
            `Couldn't delete ${name}'s number, already removed from server`,
            'error'
          );
          setPersons(persons.filter(p => p.id !== id));
        })
    }
  }

  const filterNumbers = (person) => {
    return person.name.toLowerCase().includes(newFilter.toLowerCase());
  }

  return (
    <div>
      <Notification notification={notification} />
      <h1>Phonebook</h1>
      <Filter handler={handleFilterChange} value={newFilter} />
      <AddNumber name={newName} num={newNumber} hName={handleNameChange} 
        hNum={handleNumberChange} addNum={addNumber} />
      <NumList filter={filterNumbers} persons={persons} handler={deleteHandler} />
    </div>
  );
}

export default App;