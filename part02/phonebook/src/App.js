import React, {useState} from 'react';

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Marcellus Parley', number: '555-5555' },
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ newFilter, setNewFilter ] = useState('');

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

  const addNumber = (e) => {
    e.preventDefault();
    const p = { name: newName, number: newNumber };

    if (persons.findIndex(p => p.name === newName) !== -1) {
      alert(`${newName} is already added to the phonebook`);
    } else {
      setPersons(persons.concat(p));
      setNewName('');
      setNewNumber('');
    }
  }

  const filterNumbers = (person) => {
    return person.name.toLowerCase().includes(newFilter);
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter handler={handleFilterChange} value={newFilter} />
      <AddNumber name={newName} num={newNumber} hName={handleNameChange} 
        hNum={handleNumberChange} addNum={addNumber} />
      <NumList filter={filterNumbers} persons={persons} />
    </div>
  );
}

const NumList = ({ filter, persons }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {persons.filter(filter).map((p) => <Person key={p.name} person={p} />)}
      </ul>
    </div>
  )
}

const Person = ({ person }) => {
  return <li>{person.name} {person.number}</li>
}

const AddNumber = ({ name, num, hName, hNum, addNum }) => {
  return (
    <div>
      <h2>Add Number</h2>
      <form>
        <div>
          name: <input onChange={hName} value={name} />
        </div>
        <div>
          number: <input onChange={hNum} value={num} />
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

export default App;