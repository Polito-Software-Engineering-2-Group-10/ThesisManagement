import { Application, ApplicationTable } from "./entities/application.js";
import { Degree, DegreeTable } from "./entities/degree.js";
import { Group, GroupTable } from "./entities/group.js";
import { ThesisProposal, ThesisProposalTable } from "./entities/thesis_proposal.js";
import { Student, StudentTable } from "./entities/student.js";
import { Teacher, TeacherTable } from "./entities/teacher.js";
import { Career, CareerTable } from "./entities/career.js";
import { Department, DepartmentTable } from "./entities/department.js";
import { ThesisRequest, ThesisRequestTable } from "./entities/thesis_request.js";
import { SecretaryClerk, SecretaryClerkTable } from "./entities/secretary_clerk.js";


const studentTable = await StudentTable.initialize();
const groupTable = await GroupTable.initialize();
const degreeTable = await DegreeTable.initialize();
const teacherTable = await TeacherTable.initialize();
const departmentTable = await DepartmentTable.initialize();
const careerTable = await CareerTable.initialize();
const thesisProposalTable = await ThesisProposalTable.initialize();
const applicationTable = await ApplicationTable.initialize();
const thesisRequestTable = await ThesisRequestTable.initialize();
const secretaryClerkTable = await SecretaryClerkTable.initialize();

export {
    applicationTable,
    degreeTable,
    groupTable,
    thesisProposalTable,
    studentTable,
    teacherTable,
    careerTable,
    departmentTable,
    thesisRequestTable,
    secretaryClerkTable
};