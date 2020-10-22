import React from 'react';

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

export default AddNumber;