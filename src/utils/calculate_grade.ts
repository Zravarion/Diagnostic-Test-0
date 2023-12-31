/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
import { IUniversityClass, Assignment } from "../types/api_types";
import { BASE_API_URL, MY_BU_ID, GET_DEFAULT_HEADERS } from "../globals"

/**
 * This function might help you write the function below.
 * It retrieves the final grade for a single student based on the passed params.
 * 
 * If you are reading here and you haven't read the top of the file...go back.
 */
export async function calculateStudentFinalGrade(studentID: string, klass: IUniversityClass): Promise<number> {
  const res = await fetch(BASE_API_URL + "/student/listGrades/" + studentID + "/" + klass.classId + "/?buid=" + MY_BU_ID, {
    method: "GET",
    headers: GET_DEFAULT_HEADERS()
  });
  const json = await res.json();
  

  const getClassAssignments = async () => {
    const res = await fetch(BASE_API_URL + "/class/listAssignments/" + klass.classId + "?buid=" + MY_BU_ID, {
      method: "GET",
      headers: GET_DEFAULT_HEADERS()
    });
    const assignments = await res.json();
    return assignments;
  }
  const assignments: Assignment[] = await getClassAssignments();

  let sum = 0;
  assignments.forEach((assignment: Assignment) => {
    const assignmentId = assignment.assignmentId;
    const weight = assignment.weight;
    sum+=parseInt(json.grades[0][assignmentId]) * weight/100;
  });

  sum = Math.round(sum*10)/10
  

  return sum;
}

/**
 * You need to write this function! You might want to write more functions to make the code easier to read as well.
 * 
 *  If you are reading here and you haven't read the top of the file...go back.
 * 
 * @param classID The ID of the class for which we want to calculate the final grades
 * @returns Some data structure that has a list of each student and their final grade.
 */
export async function calcAllFinalGrade(classID: string): Promise<undefined> {
  return undefined;
}
