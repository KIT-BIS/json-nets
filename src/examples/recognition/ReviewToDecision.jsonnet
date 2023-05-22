request
{
  email: student.email,
  accepted: std.member(lecture.levels, student.level)
    && std.member(lecture.studyPrograms, student.studyProgram)
    && std.member(lecture.recognizableLectures, {
            universityId: request.foreignUniversity,
            lecture: request.foreignLecture
          })
}