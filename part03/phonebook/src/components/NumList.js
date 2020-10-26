import React from 'react';

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

export default NumList;