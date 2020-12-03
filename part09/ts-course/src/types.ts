// new types
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDesc extends CoursePartBase {
  description: string;
}

interface CoursePartOne extends CoursePartDesc {
  name: "Fundamentals";
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartDesc {
  name: "Deeper type usage";
  exerciseSubmissionLink: string;
}

interface CoursePartFour extends CoursePartDesc {
  name: "Typescript tedium";
  patienceLeft: number;
}

export type CoursePart = CoursePartOne | CoursePartTwo 
  | CoursePartThree | CoursePartFour;