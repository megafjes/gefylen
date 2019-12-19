import './studentflow.css';

import * as d3 from 'd3';

import { test } from './test';
import { sedimentary } from './sedimentary';

const studentsTemplate = [
  {
    studentStartSemester: 2017.5,
    dateOfBirth: new Date('December 17, 1998'),
    countyNorwegianOrigin: 'Telemark',
    countryForeignOrigin: false,
    takenCourses: [
      {
        courseName: 'ABC1001',
        prescribedProgressionSemester: 1,
        semesterTaken: 1,
        result: 'C'
      }
    ]
  }
];

// const students = [];
// for (var i = 2000.5; i < 2020; i += 1) {
//   const takenCourses = [];
//   for ()
// }






// calculate progressionPercent and add field to students

// calculated
const sedimentaryLayersTemplate = [
  {
    semesterStarted: 2015.5,
    progression: [
      {
        semester: 2016,
        registeredStudents: 155
      }
    ],
    cumulative: [
      {
        semester: 2016,
        registeredStudents: 998 // cumulative with all students having started earlier
      }
    ]
  }
];

// calculated
const coursesTemplate = [
  {
    courseName: 'ABC1001',
    history: [
      {
        semester: 2016.5,
        attended: 61,
        results: {
          A: 1,
          B: 24,
          C: 12,
          D: 13,
          E: 4,
          F: 2,
          dropped: 15,
          sick: 1
        },
        recurringStudentsFrom: [
          {
            fromSemester: 2015.5,
            numberOfStudents: 5
          }
        ]
      }
    ]
  }
]

sedimentary();
// test();