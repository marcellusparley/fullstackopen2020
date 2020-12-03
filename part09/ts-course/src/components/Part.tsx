import React from 'react';
import { CoursePart } from "../types";

const Part: React.FC<CoursePart> = (props) => {
  switch (props.name) {
    case "Fundamentals":
      return <div>
        <h3>{props.name}</h3>
        <p>Exercises: {props.exerciseCount}</p>
        <p>{props.description}</p>
      </div>
    case "Using props to pass data":
      return <div>
        <h3>{props.name}</h3>
        <p>Exercises: {props.exerciseCount}</p>
        <p>Group Projects: {props.groupProjectCount}</p>
      </div>
    case "Deeper type usage":
      return <div>
        <h3>{props.name}</h3>
        <p>Exercises: {props.exerciseCount}</p>
        <p>Sumission Link: {props.exerciseSubmissionLink}</p>
        <p>{props.description}</p>
      </div>
    case "Typescript tedium":
      return <div>
        <h3>{props.name}</h3>
        <p>Exercises: {props.exerciseCount}</p>
        <p>Caring level: {props.patienceLeft} %</p>
        <p>{props.description}</p>
      </div>
    default:
      return <div></div>
  }
}

export default Part;