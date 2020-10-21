import React from 'react';

const Filter = ({handler , value}) => {
  return (
    <div>
      <label>
        Find Countries <input onChange={handler} value={value} />
      </label>
    </div>
  )
}

export default Filter;