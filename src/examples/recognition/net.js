export default {
    "places": [
        {
            "id": "167d54d6-3a73-40f7-b317-0aa3580a44ac",
            "name": "Request",
            "content": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "requestId": {
                            "type": "integer"
                        },
                        "studentId": {
                            "type": "string"
                        },
                        "foreignUniversity": {
                            "type": "string"
                        },
                        "foreignLecture": {
                            "type": "string"
                        },
                        "homeLecture": {
                            "type": "string"
                        },
                        "grade": {
                            "type": "number"
                        }
                    },
                    "required": [
                        "requestId",
                        "studentId",
                        "foreignUniversity",
                        "foreignLecture",
                        "homeLecture",
                        "grade"
                    ]
                },
                "data": [
                    {
                        "requestId": 1,
                        "studentId": "student-1",
                        "foreignUniversity": "university-1",
                        "foreignLecture": "Software Engineering and Technology",
                        "homeLecture": "Software Engineering",
                        "grade": 1.3
                    },
                    {
                        "requestId": 2,
                        "studentId": "student-1",
                        "foreignUniversity": "university-1",
                        "foreignLecture": "Big Data and NoSQL",
                        "homeLecture": "Advanced Database Systems",
                        "grade": 2
                    }
                ]
            }
        },
        {
            "id": "9a172fc4-04cd-49d1-94f3-b8b62d2aed42",
            "name": "Decision",
            "content": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "requestId": {
                            "type": "integer"
                        },
                        "studentId": {
                            "type": "string"
                        },
                        "foreignUniversity": {
                            "type": "string"
                        },
                        "foreignLecture": {
                            "type": "string"
                        },
                        "homeLecture": {
                            "type": "string"
                        },
                        "accepted": {
                            "type": "boolean"
                        },
                        "grade": {
                            "type": "number"
                        },
                        "email": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "requestId",
                        "studentId",
                        "foreignUniversity",
                        "foreignLecture",
                        "homeLecture",
                        "accepted",
                        "grade",
                        "email"
                    ]
                },
                "data": []
            }
        },
        {
            "id": "48b440c6-43fc-4df6-b874-f758137e90e5",
            "name": "Student",
            "content": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "studentId": {
                            "type": "string"
                        },
                        "level": {
                            "type": "string",
                            "enum": [
                                "Bachelor",
                                "Master"
                            ]
                        },
                        "studyProgram": {
                            "type": "string"
                        },
                        "email": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "studentId",
                        "level",
                        "studyProgram",
                        "email"
                    ]
                },
                "data": [
                    {
                        "studentId": "student-1",
                        "level": "Master",
                        "studyProgram": "Information Systems",
                        "email": "student@uni.edu"
                    }
                ]
            }
        },
        {
            "id": "846b0b51-9981-40ad-a36a-5ee873f4de5a",
            "name": "Lecture",
            "content": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string"
                        },
                        "levels": {
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "Bachelor",
                                    "Master"
                                ]
                            }
                        },
                        "studyPrograms": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "recognizableLectures": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "universityId": {
                                        "type": "string"
                                    },
                                    "lecture": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "universityId",
                                    "lecture"
                                ]
                            }
                        }
                    },
                    "required": [
                        "name",
                        "levels",
                        "studyPrograms",
                        "recognizableLectures"
                    ]
                },
                "data": [
                    {
                        "name": "Software Engineering",
                        "levels": [
                            "Bachelor"
                        ],
                        "studyPrograms": [
                            "Information Systems",
                            "Computer Science"
                        ],
                        "recognizableLectures": [
                            {
                                "universityId": "university-1",
                                "lecture": "Software Engineering and Technology"
                            }
                        ]
                    },
                    {
                        "name": "Advanced Database Systems",
                        "levels": [
                            "Master"
                        ],
                        "studyPrograms": [
                            "Information Systems",
                            "Computer Science"
                        ],
                        "recognizableLectures": [
                            {
                                "universityId": "university-1",
                                "lecture": "Big Data and NoSQL"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "daa76eb3-c88c-4f29-9903-43f2892d70da",
            "name": "Notification",
            "content": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "email": {
                            "type": "string"
                        },
                        "body": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "email",
                        "body"
                    ]
                },
                "data": []
            }
        },
        {
            "id": "e6caf7c5-fe05-47fa-8179-cf3b7b3cad2a",
            "name": "Grade",
            "content": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "studentId": {
                            "type": "string"
                        },
                        "lecture": {
                            "type": "string"
                        },
                        "grade": {
                            "type": "number"
                        }
                    },
                    "required": [
                        "studentId",
                        "lecture",
                        "grade"
                    ]
                },
                "data": []
            }
        }
    ],
    "transitions": [
        {
            "id": "1952db8b-764c-45da-b2d4-8b1537400377",
            "name": "Review",
            "content": "local checkLecture = lecture.name == request.homeLecture;\nlocal checkStudent = student.studentId == request.studentId;\n\ncheckLecture && checkStudent"
        },
        {
            "id": "0e1c227f-c03b-4969-be2b-9b151898a35c",
            "name": "Accept",
            "content": "true"
        },
        {
            "id": "82ca126e-1b63-40ad-9f92-d156da6823b8",
            "name": "Reject",
            "content": "true"
        }
    ],
    "arcs": [
        {
            "id": "bccd1686-bed4-4ae9-a6c2-18628a877a20",
            "label": {
                "type": "consume",
                "filter": ""
            },
            "fromId": "167d54d6-3a73-40f7-b317-0aa3580a44ac",
            "toId": "1952db8b-764c-45da-b2d4-8b1537400377"
        },
        {
            "id": "77dda9ce-2847-415b-833c-74b785a53f98",
            "label": {
                "type": "read",
                "filter": ""
            },
            "fromId": "48b440c6-43fc-4df6-b874-f758137e90e5",
            "toId": "1952db8b-764c-45da-b2d4-8b1537400377"
        },
        {
            "id": "b424c701-1789-4dbb-9fd1-a7ca5ca5fced",
            "label": {
                "type": "read",
                "filter": ""
            },
            "fromId": "846b0b51-9981-40ad-a36a-5ee873f4de5a",
            "toId": "1952db8b-764c-45da-b2d4-8b1537400377"
        },
        {
            "id": "e98f7b6e-47cc-47ec-9462-041597a82b25",
            "label": "request\n{\n  email: student.email,\n  accepted: std.member(lecture.levels, student.level)\n    && std.member(lecture.studyPrograms, student.studyProgram)\n    && std.member(lecture.recognizableLectures, {\n            universityId: request.foreignUniversity,\n            lecture: request.foreignLecture\n          })\n}",
            "fromId": "1952db8b-764c-45da-b2d4-8b1537400377",
            "toId": "9a172fc4-04cd-49d1-94f3-b8b62d2aed42"
        },
        {
            "id": "37d5e2b6-f0a6-4945-93b7-e24f7ce7e3b9",
            "label": {
                "type": "consume",
                "filter": "?(@.accepted == true)"
            },
            "fromId": "9a172fc4-04cd-49d1-94f3-b8b62d2aed42",
            "toId": "0e1c227f-c03b-4969-be2b-9b151898a35c"
        },
        {
            "id": "eda07d3d-ee62-4b0e-a70d-85acdb6545cf",
            "label": {
                "type": "consume",
                "filter": "?(@.accepted == false)"
            },
            "fromId": "9a172fc4-04cd-49d1-94f3-b8b62d2aed42",
            "toId": "82ca126e-1b63-40ad-9f92-d156da6823b8"
        },
        {
            "id": "a79f5ef6-879c-40fa-b4bc-31d27dffa196",
            "label": "{\n  email: decision.email,\n  body: \"Your request with id \" + decision.requestId + \" was rejected.\"\n}",
            "fromId": "82ca126e-1b63-40ad-9f92-d156da6823b8",
            "toId": "daa76eb3-c88c-4f29-9903-43f2892d70da"
        },
        {
            "id": "a437c2b6-431b-437e-bc4c-f0a418a0e055",
            "label": "{\n  email: decision.email,\n  body: \"Your request with id \" + decision.requestId + \" was accepted.\"\n}",
            "fromId": "0e1c227f-c03b-4969-be2b-9b151898a35c",
            "toId": "daa76eb3-c88c-4f29-9903-43f2892d70da"
        },
        {
            "id": "dbdd246a-b0b9-469c-bf0a-7840ecd6e3ff",
            "label": "{\n  grade: decision.grade,\n  studentId: decision.studentId,\n  lecture: decision.homeLecture\n}",
            "fromId": "0e1c227f-c03b-4969-be2b-9b151898a35c",
            "toId": "e6caf7c5-fe05-47fa-8179-cf3b7b3cad2a"
        }
    ]
}; 