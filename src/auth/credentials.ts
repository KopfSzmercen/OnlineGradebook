import { Teacher } from "../models/teacher";
import { Student } from "../models/student";

export const teacherHasStudent = async (teacherId: string, studId: string) => {
  const currentTeacher = await Teacher.findOne({
    _id: teacherId
  }).populate({ path: "classes" });

  let validCredentials = false;
  currentTeacher.classes.forEach((c: any) => {
    c.students.forEach((s: any) => {
      if (s == studId) {
        validCredentials = true;
      }
    });
  });

  return validCredentials;
};
