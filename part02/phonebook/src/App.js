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

const App = () => {
  const [ persons, setPersons ] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ newFilter, setNewFilter ] = useState('');

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

  //Handler for add number button
  const addNumber = (e) => {
    e.preventDefault();
    const p = { name: newName, number: newNumber };
    const pin = persons.findIndex(p => p.name === newName);

    //Check if person's number is already in phonebook and asks
    //if user would like to update their number
    if ( pin !== -1) {
      const pid = persons[pin].id;
      if (window.confirm(`${newName} is already added to the phonebook, would you like to update the number?`)) {
        numService
          .updateNumber(pid, p)
          .then(returnedPerson => {
            setPersons(persons.map(per => per.id !== pid ? per : returnedPerson));
            setNewNumber('');
            setNewName('');
          })
          .catch(e => {
            alert('Couldn\'t update number');
          })
      }
    } else {
      numService
        .createNumber(p)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
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
        })
        .catch(e => {
          alert(`Unable to delete number for ${name}`);
        })
    }
  }

  const filterNumbers = (person) => {
    return person.name.toLowerCase().includes(newFilter.toLowerCase());
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter handler={handleFilterChange} value={newFilter} />
      <AddNumber name={newName} num={newNumber} hName={handleNameChange} 
        hNum={handleNumberChange} addNum={addNumber} />
      <NumList filter={filterNumbers} persons={persons} handler={deleteHandler} />
    </div>
  );
}

/*
const NumList = ({ filter, persons, handler }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {persons.filter(filter).map((p) => {
          return (
            <Person 
              key={p.name} 
              person={p} 
              handler={handler} 
            />
          )
        })}
      </ul>
    </div>
  )
}

const Person = ({ person, handler }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={() => handler(person.id, person.name)}>Delete</button>
    </li>
  )
}

const AddNumber = ({ name, num, hName, hNum, addNum }) => {
  return (
    <div>
      <h2>Add Number</h2>
      <form>
        <div>
          Name: <input onChange={hName} value={name} />
        </div>
        <div>
          Number: <input onChange={hNum} value={num} />
        </div>
        <div>
          <button onClick={addNum} type='submit'>add</button>
        </div>
      </form>
    </div>
  )
}

const Filter = ({ handler, value }) => {
  return (
    <div>
      Filter <input onChange={handler} value={value} />
    </div>
  )
}
*/

export default App;