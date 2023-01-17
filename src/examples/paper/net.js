export const importData = {
  'places': [
    {
      'id': '2b9d6f34-88b0-4dca-9abc-5784af1f3269',
      'x': 81,
      'y': 227,
      'data': {
        'schema': {
          'type': 'object',
          'properties': {
            'studentId': {
              'type': 'string',
            },
            'level': {
              'type': 'string',
              'enum': [
                'Bachelor',
                'Master',
              ],
            },
            'studyProgram': {
              'type': 'string',
            },
            'email': {
              'type': 'string',
            },
          },
          'required': [
            'studentId',
            'level',
            'studyProgram',
            'email',
          ],
        },
        'data': [
          {
            'studentId': 'student-1',
            'level': 'Master',
            'studyProgram': 'Information Systems',
            'email': 'student@uni.edu',
          },
        ],
      },
    },
    {
      'id': '22573d4e-a764-4fcf-a3e0-1bd9f815290b',
      'x': 87,
      'y': 466,
      'data': {
        'schema': {
          'type': 'object',
          'properties': {
            'requestId': {
              'type': 'integer',
            },
            'studentId': {
              'type': 'string',
            },
            'foreignUniversity': {
              'type': 'string',
            },
            'foreignLecture': {
              'type': 'string',
            },
            'homeLecture': {
              'type': 'string',
            },
            'grade': {
              'type': 'number',
            },
          },
          'required': [
            'requestId',
            'studentId',
            'foreignUniversity',
            'foreignLecture',
            'homeLecture',
            'grade',
          ],
        },
        'data': [
          {
            'requestId': 1,
            'studentId': 'student-1',
            'foreignUniversity': 'university-1',
            'foreignLecture': 'Software Engineering and Technology',
            'homeLecture': 'Software Engineering',
            'grade': 1.3,
          },
          {
            'requestId': 2,
            'studentId': 'student-1',
            'foreignUniversity': 'university-1',
            'foreignLecture': 'Big Data and NoSQL',
            'homeLecture': 'Advanced Database Systems',
            'grade': 2,
          },
        ],
      },
    },
    {
      'id': 'd683fff8-58f3-4b3b-9470-d65f3f521bb0',
      'x': 238,
      'y': 120,
      'data': {
        'schema': {},
        'data': [
          {
            'name': 'Software Engineering',
            'levels': [
              'Bachelor',
            ],
            'studyPrograms': [
              'Information Systems',
              'Computer Science',
            ],
            'recognizableLectures': [
              {
                'universityId': 'university-1',
                'lecture': 'Software Engineering and Technology',
              },
            ],
          },
          {
            'name': 'Advanced Database Systems',
            'levels': [
              'Master',
            ],
            'studyPrograms': [
              'Information Systems',
              'Computer Science',
            ],
            'recognizableLectures': [
              {
                'universityId': 'university-1',
                'lecture': 'Big Data and NoSQL',
              },
            ],
          },
        ],
      },
    },
    {
      'id': '93809219-3291-4a31-9621-5f018463f6fd',
      'x': 445,
      'y': 347,
      'data': {
        'schema': {
          'type': 'object',
          'properties': {
            'requestId': {
              'type': 'integer',
            },
            'studentId': {
              'type': 'string',
            },
            'foreignUniversity': {
              'type': 'string',
            },
            'foreignLecture': {
              'type': 'string',
            },
            'homeLecture': {
              'type': 'string',
            },
            'accepted': {
              'type': 'boolean',
            },
            'grade': {
              'type': 'number',
            },
            'email': {
              'type': 'string',
            },
          },
          'required': [
            'requestId',
            'studentId',
            'foreignUniversity',
            'foreignLecture',
            'homeLecture',
            'accepted',
            'grade',
            'email',
          ],
        },
        'data': [
          {
            'accepted': false,
            'email': 'student@uni.edu',
            'foreignLecture': 'Software Engineering and Technology',
            'foreignUniversity': 'university-1',
            'grade': 1.3,
            'homeLecture': 'Software Engineering',
            'requestId': 1,
            'studentId': 'student-1',
          },
          {
            'accepted': true,
            'email': 'student@uni.edu',
            'foreignLecture': 'Big Data and NoSQL',
            'foreignUniversity': 'university-1',
            'grade': 2,
            'homeLecture': 'Advanced Database Systems',
            'requestId': 2,
            'studentId': 'student-1',
          },
        ],
      },
    },
    {
      'id': '709873c5-3baa-4dd5-96a9-0cf3246d18ca',
      'x': 858,
      'y': 354,
      'data': {
        'schema': {
          'type': 'object',
          'properties': {
            'email': {
              'type': 'string',
            },
            'body': {
              'type': 'string',
            },
          },
          'required': [
            'email',
            'body',
          ],
        },
        'data': [],
      },
    },
  ],
  'transitions': [
    {
      'id': 'a698ae60-1a8e-40d3-8e59-6d0622138a60',
      'x': 260,
      'y': 349,
      'content': 'local checkLecture = lecture.name == request.homeLecture;\r\nlocal checkStudent = student.studentId == request.studentId;\r\n\r\ncheckLecture && checkStudent',
    },
    {
      'id': '9e85b6df-223a-42ed-b8f7-4edaf5a4d765',
      'x': 666,
      'y': 212,
    },
    {
      'id': 'e7b6f8be-df59-4eee-9173-5227dedc8fd8',
      'x': 667,
      'y': 469,
    },
  ],
  'edges': [
    {
      'id': '3429d978-60f0-4417-9d77-1fd819169654',
      'fromId': '22573d4e-a764-4fcf-a3e0-1bd9f815290b',
      'toId': 'a698ae60-1a8e-40d3-8e59-6d0622138a60',
      'label': {
        'mode': 'delete',
        'filter': {},
      },
    },
    {
      'id': 'df4071ba-aa58-4dc8-aeb0-1f05753d6440',
      'fromId': '2b9d6f34-88b0-4dca-9abc-5784af1f3269',
      'toId': 'a698ae60-1a8e-40d3-8e59-6d0622138a60',
      'label': {
        'mode': 'delete',
        'filter': {},
      },
    },
    {
      'id': 'ab02a00c-eb87-4623-8b71-d6790c3358dd',
      'fromId': 'd683fff8-58f3-4b3b-9470-d65f3f521bb0',
      'toId': 'a698ae60-1a8e-40d3-8e59-6d0622138a60',
      'label': {
        'mode': 'delete',
        'filter': {},
      },
    },
    {
      'id': 'c725d77a-a3e9-4c79-9603-66b854a4c0f6',
      'fromId': 'a698ae60-1a8e-40d3-8e59-6d0622138a60',
      'toId': '93809219-3291-4a31-9621-5f018463f6fd',
      'label': {
        'data': {},
      },
    },
    {
      'id': 'c7ca0265-ef9b-4469-aa3d-cac1a1f4b5cc',
      'fromId': '93809219-3291-4a31-9621-5f018463f6fd',
      'toId': '9e85b6df-223a-42ed-b8f7-4edaf5a4d765',
      'label': {
        'mode': 'delete',
        'filter': {},
      },
    },
    {
      'id': 'a1ff5a9e-0c7f-47af-a38c-d8ed5168cd68',
      'fromId': '93809219-3291-4a31-9621-5f018463f6fd',
      'toId': 'e7b6f8be-df59-4eee-9173-5227dedc8fd8',
      'label': {
        'mode': 'delete',
        'filter': {},
      },
    },
    {
      'id': 'fb3e8b6a-ff1e-4bf1-8865-0d03333d5956',
      'fromId': 'e7b6f8be-df59-4eee-9173-5227dedc8fd8',
      'toId': '709873c5-3baa-4dd5-96a9-0cf3246d18ca',
      'label': {
        'data': {},
      },
    },
    {
      'id': 'e8d60dc5-0636-460f-b7f9-867468665a41',
      'fromId': '9e85b6df-223a-42ed-b8f7-4edaf5a4d765',
      'toId': '709873c5-3baa-4dd5-96a9-0cf3246d18ca',
      'label': {
        'data': {},
      },
    },
    {
      'id': 'fb184f2b-930a-4728-b820-3bc632b1ae2b',
      'fromId': '22573d4e-a764-4fcf-a3e0-1bd9f815290b',
      'toId': 'a698ae60-1a8e-40d3-8e59-6d0622138a60',
      'label': {
        'mode': 'delete',
        'filter': {},
      },
    },
    {
      'id': 'cffc302a-dc7b-48f1-a7f2-c62018fd0090',
      'fromId': '2b9d6f34-88b0-4dca-9abc-5784af1f3269',
      'toId': 'a698ae60-1a8e-40d3-8e59-6d0622138a60',
      'label': {
        'mode': 'delete',
        'filter': {},
      },
    },
    {
      'id': 'eca8accb-04b5-4c62-a6e1-5f6e10ad3dcd',
      'fromId': 'd683fff8-58f3-4b3b-9470-d65f3f521bb0',
      'toId': 'a698ae60-1a8e-40d3-8e59-6d0622138a60',
      'label': {
        'mode': 'delete',
        'filter': {},
      },
    },
    {
      'id': '39ac26de-7057-4f79-9093-44d42e2d6f7f',
      'fromId': 'a698ae60-1a8e-40d3-8e59-6d0622138a60',
      'toId': '93809219-3291-4a31-9621-5f018463f6fd',
      'label': {
        'data': {},
      },
    },
    {
      'id': '12098b39-d58d-4c54-97da-6f50fa9b4fab',
      'fromId': '93809219-3291-4a31-9621-5f018463f6fd',
      'toId': '9e85b6df-223a-42ed-b8f7-4edaf5a4d765',
      'label': {
        'mode': 'delete',
        'filter': {},
      },
    },
    {
      'id': '6818e77d-8200-45fc-86b9-3effb56c28dd',
      'fromId': '93809219-3291-4a31-9621-5f018463f6fd',
      'toId': 'e7b6f8be-df59-4eee-9173-5227dedc8fd8',
      'label': {
        'mode': 'delete',
        'filter': {},
      },
    },
    {
      'id': 'b1ffbf3c-e4ba-418c-a127-4250c9419096',
      'fromId': 'e7b6f8be-df59-4eee-9173-5227dedc8fd8',
      'toId': '709873c5-3baa-4dd5-96a9-0cf3246d18ca',
      'label': {
        'data': {},
      },
    },
    {
      'id': '48f0f208-8ba8-4ca3-8423-0bb53bfcb92c',
      'fromId': '9e85b6df-223a-42ed-b8f7-4edaf5a4d765',
      'toId': '709873c5-3baa-4dd5-96a9-0cf3246d18ca',
      'label': {
        'data': {},
      },
    },
  ],
};
