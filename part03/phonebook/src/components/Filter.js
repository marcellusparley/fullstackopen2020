import React from 'react';

const Filter = ({ handler, value }) => {
  return (
    <div>
      Filter <input onChange={handler} value={value} />
    </div>
  )
}

export default Filter;