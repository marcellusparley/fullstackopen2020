import React from 'react';

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = ({ course }) => {
  return (
    <>
      <h2>{course}</h2>
    </>
  );
};

const Part = ({ name, exercises }) => {
  return (
    <>
      <p>{name} {exercises}</p>
    </>
  )
};

const Content = ({ parts }) => {
  console.log('Content parts is', parts);
  return (
    <>
      {parts.map(part => <Part key={part.id} 
        name={part.name} exercises={part.exercises}/>)}
    </>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((acc, cur) => acc + cur.exercises, 0);

  return (
    <div>
      <p><b>Number of exercises {total}</b></p>
    </div>
  )
}

export default Course;