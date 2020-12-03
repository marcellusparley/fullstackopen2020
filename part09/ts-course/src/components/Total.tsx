import React from 'react';

const Total: React.FC<{ parts: { name: string, exerciseCount: number}[] }> = ({ parts }) => {
  return (
    <div>
      <p>
        Number of exercises{" "}
        {parts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </div>
  );
};

export default Total;