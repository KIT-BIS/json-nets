local checkLecture = lecture.name == request.homeLecture;
local checkStudent = student.studentId == request.studentId;

checkLecture && checkStudent