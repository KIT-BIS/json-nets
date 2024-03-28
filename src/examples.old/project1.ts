export const data = {
  "netData": {
    "places": [
      {
        "id": "8ebec2fa-d25c-4a6d-a458-154333851a62",
        "name": "project initialization",
        "marking": [
          {
            "pid": "p1",
            "projname": "Moonshot1",
            "open_tasks": [
              "collect_moondust",
              "fly_spaceship"
            ]
          }
        ],
        "schema": {
          "type": "object",
          "properties": {
            "pid": {
              "type": "string"
            },
            "projname": {
              "type": "string"
            },
            "open_tasks": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "pid",
            "projname",
            "open_tasks"
          ]
        }
      },
      {
        "id": "cbd21014-6ddd-48b2-bb71-73d6f73a1b2d",
        "name": "planned project",
        "marking": [],
        "schema": {
          "type": "object",
          "properties": {
            "pid": {
              "type": "string"
            },
            "projname": {
              "type": "string"
            },
            "open_tasks": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "team": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "task": {
                    "type": "string"
                  },
                  "member": {
                    "type": "string"
                  }
                },
                "required": [
                  "task",
                  "member"
                ]
              }
            }
          },
          "required": [
            "pid",
            "projname",
            "open_tasks",
            "team"
          ]
        }
      },
      {
        "id": "4afa856d-8026-444e-adbf-4361dee07b14",
        "name": "running project",
        "marking": [],
        "schema": {
          "type": "object",
          "properties": {
            "pid": {
              "type": "string"
            },
            "projname": {
              "type": "string"
            },
            "team": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "task": {
                    "type": "string"
                  },
                  "member": {
                    "type": "string"
                  }
                },
                "required": [
                  "task",
                  "member"
                ]
              }
            }
          },
          "required": [
            "pid",
            "projname",
            "team"
          ]
        }
      },
      {
        "id": "8faee6b2-4bac-4122-8f8f-9288c7d620d4",
        "name": "finished project",
        "marking": [],
        "schema": {
          "type": "object",
          "properties": {
            "pid": {
              "type": "string"
            },
            "projname": {
              "type": "string"
            },
            "team": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "task": {
                    "type": "string"
                  },
                  "member": {
                    "type": "string"
                  }
                },
                "required": [
                  "task",
                  "member"
                ]
              }
            }
          },
          "required": [
            "pid",
            "projname",
            "team"
          ]
        }
      },
      {
        "id": "8fb8aeea-41fb-4b94-9b3f-a11db064d29b",
        "name": "lesson learned",
        "marking": [
          {
            "lessons": []
          }
        ],
        "schema": {
          "type": "object",
          "properties": {
            "lessons": {
              "type": "array"
            }
          }
        }
      },
      {
        "id": "51af7a83-4909-4ea0-a925-4c386e9c5582",
        "name": "employee",
        "marking": [],
        "schema": {
          "type": "object",
          "properties": {
            "empid": {
              "type": "string"
            },
            "empname": {
              "type": "string"
            },
            "work_in_proj": {
              "type": [
                "string",
                "null"
              ],
              "default": null
            },
            "skills": {
              "type": "array"
            }
          },
          "required": [
            "empid",
            "empname",
            "skills"
          ]
        }
      }
    ],
    "transitions": [
      {
        "id": "ceef5696-f9be-48c3-9222-34711b487bf8",
        "name": "initialize project",
        "preface": "",
        "guard": "true",
        "keyVarSnippets": {
          "output_plannedProject_key": "local output_plannedProject_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_plannedProject_value": "local output_plannedProject_value = {};"
        }
      },
      {
        "id": "be1b5311-0352-4159-954c-0366da8f31fc",
        "name": "start project",
        "preface": "",
        "guard": "true",
        "keyVarSnippets": {
          "output_runningProject_key": "local output_runningProject_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_runningProject_value": "local output_runningProject_value = {};"
        }
      },
      {
        "id": "4c9cbf53-2412-4844-9869-a188e913adff",
        "name": "finish project",
        "preface": "",
        "guard": "true",
        "keyVarSnippets": {
          "output_finishedProject_key": "local output_finishedProject_key = '-';",
          "output_lessonLearned_key": "local output_lessonLearned_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_finishedProject_value": "local output_finishedProject_value = {input_runningProject_value};",
          "output_lessonLearned_value": "local output_lessonLearned_value = {};"
        }
      },
      {
        "id": "0704140a-ccc3-436b-99ea-54ae79e822e9",
        "name": "assign employee",
        "preface": "",
        "guard": "true",
        "keyVarSnippets": {
          "output_plannedProject_key": "local output_plannedProject_key = '-';",
          "output_employee_key": "local output_employee_key = 'work_in_proj';"
        },
        "fragmentVarSnippets": {
          "output_plannedProject_value": "local output_plannedProject_value = {};",
          "output_employee_value": "local output_employee_value = output_plannedProject_token.pid;"
        }
      },
      {
        "id": "5a720469-21f0-4789-afba-bfe43be6bb9a",
        "name": "update employee",
        "preface": "",
        "guard": "true",
        "keyVarSnippets": {
          "output_employee_key": "local output_employee_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_employee_value": "local output_employee_value = {};"
        }
      }
    ],
    "arcs": [
      {
        "id": "c502fcbe-ec0e-4170-acf1-f7d4f915150d",
        "filter": "$.*",
        "fromId": "8ebec2fa-d25c-4a6d-a458-154333851a62",
        "toId": "ceef5696-f9be-48c3-9222-34711b487bf8"
      },
      {
        "id": "9444e7a3-38fd-4392-ba4e-c7ad0a1274b6",
        "filter": "$",
        "fromId": "ceef5696-f9be-48c3-9222-34711b487bf8",
        "toId": "cbd21014-6ddd-48b2-bb71-73d6f73a1b2d"
      },
      {
        "id": "40f4b2ff-02a8-4d87-9708-740a63b285ef",
        "filter": "$.*",
        "fromId": "cbd21014-6ddd-48b2-bb71-73d6f73a1b2d",
        "toId": "be1b5311-0352-4159-954c-0366da8f31fc"
      },
      {
        "id": "e39ac192-7156-4f6f-b418-69fd3a6e0de1",
        "filter": "$",
        "fromId": "be1b5311-0352-4159-954c-0366da8f31fc",
        "toId": "4afa856d-8026-444e-adbf-4361dee07b14"
      },
      {
        "id": "5b9ce254-cf34-421e-a5ab-8cb0ef195b59",
        "filter": "$.*",
        "fromId": "4afa856d-8026-444e-adbf-4361dee07b14",
        "toId": "4c9cbf53-2412-4844-9869-a188e913adff"
      },
      {
        "id": "94305b62-c3c5-471d-9cc7-f6585eadcedd",
        "filter": "$",
        "fromId": "4c9cbf53-2412-4844-9869-a188e913adff",
        "toId": "8faee6b2-4bac-4122-8f8f-9288c7d620d4"
      },
      {
        "id": "5721946a-1a1f-4225-b63a-789fef3a7428",
        "filter": "$",
        "fromId": "0704140a-ccc3-436b-99ea-54ae79e822e9",
        "toId": "cbd21014-6ddd-48b2-bb71-73d6f73a1b2d"
      },
      {
        "id": "d2fad06e-e996-4b74-a573-c1f2ab0b9183",
        "filter": "$.*",
        "fromId": "0704140a-ccc3-436b-99ea-54ae79e822e9",
        "toId": "51af7a83-4909-4ea0-a925-4c386e9c5582"
      },
      {
        "id": "96d4bd52-de50-4314-8c8b-82b310d77451",
        "filter": "$.*",
        "fromId": "51af7a83-4909-4ea0-a925-4c386e9c5582",
        "toId": "5a720469-21f0-4789-afba-bfe43be6bb9a"
      },
      {
        "id": "c194a9df-44ab-484d-8682-38b3488e86e0",
        "filter": "$",
        "fromId": "5a720469-21f0-4789-afba-bfe43be6bb9a",
        "toId": "51af7a83-4909-4ea0-a925-4c386e9c5582"
      },
      {
        "id": "a8a10fb2-38fc-4b55-9603-153d99406076",
        "filter": "$.*",
        "fromId": "4c9cbf53-2412-4844-9869-a188e913adff",
        "toId": "8fb8aeea-41fb-4b94-9b3f-a11db064d29b"
      },
      {
        "id": "5b1f42b0-bf49-4343-bcb4-cafef2a3895f",
        "filter": "$.*.lessons.*",
        "fromId": "8fb8aeea-41fb-4b94-9b3f-a11db064d29b",
        "toId": "5a720469-21f0-4789-afba-bfe43be6bb9a"
      },
      {
        "id": "c2df2460-099c-4401-b2c7-916060339394",
        "filter": "$.*",
        "fromId": "cbd21014-6ddd-48b2-bb71-73d6f73a1b2d",
        "toId": "0704140a-ccc3-436b-99ea-54ae79e822e9"
      }
    ]
  },
  "layoutData": {
    "cells": [
      {
        "type": "pn.Transition",
        "size": {
          "width": 100,
          "height": 50
        },
        "position": {
          "x": 150,
          "y": 25
        },
        "angle": 0,
        "id": "ceef5696-f9be-48c3-9222-34711b487bf8",
        "jsonnetsType": "transition",
        "z": 1,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "initialize project"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          }
        }
      },
      {
        "type": "pn.Transition",
        "size": {
          "width": 100,
          "height": 50
        },
        "position": {
          "x": 504,
          "y": 24
        },
        "angle": 0,
        "id": "be1b5311-0352-4159-954c-0366da8f31fc",
        "jsonnetsType": "transition",
        "z": 2,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "start project"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          }
        }
      },
      {
        "type": "pn.Transition",
        "size": {
          "width": 100,
          "height": 50
        },
        "position": {
          "x": 852,
          "y": 24
        },
        "angle": 0,
        "id": "4c9cbf53-2412-4844-9869-a188e913adff",
        "jsonnetsType": "transition",
        "z": 3,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "finish project"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          }
        }
      },
      {
        "type": "pn.Transition",
        "size": {
          "width": 100,
          "height": 50
        },
        "position": {
          "x": 324,
          "y": 216
        },
        "angle": 0,
        "id": "0704140a-ccc3-436b-99ea-54ae79e822e9",
        "jsonnetsType": "transition",
        "z": 4,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "assign employee"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          }
        }
      },
      {
        "type": "pn.Transition",
        "size": {
          "width": 100,
          "height": 50
        },
        "position": {
          "x": 852,
          "y": 360
        },
        "angle": 0,
        "id": "5a720469-21f0-4789-afba-bfe43be6bb9a",
        "jsonnetsType": "transition",
        "z": 5,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "update employee"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          }
        }
      },
      {
        "type": "pn.Place",
        "size": {
          "width": 50,
          "height": 50
        },
        "position": {
          "x": 0,
          "y": 25
        },
        "angle": 0,
        "tokens": 1,
        "id": "8ebec2fa-d25c-4a6d-a458-154333851a62",
        "jsonnetsType": "place",
        "z": 6,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "project initialization"
          },
          ".tokens > circle": {
            "fill": "#7a7e9b"
          },
          ".alot > text": {
            "fill": "#7a7e9b",
            "font-family": "Courier New",
            "font-size": 20,
            "font-weight": "bold",
            "ref-x": 0,
            "ref-y": 0,
            "y-alignment": -0.2
          }
        }
      },
      {
        "type": "pn.Place",
        "size": {
          "width": 50,
          "height": 50
        },
        "position": {
          "x": 348,
          "y": 24
        },
        "angle": 0,
        "tokens": 0,
        "id": "cbd21014-6ddd-48b2-bb71-73d6f73a1b2d",
        "jsonnetsType": "place",
        "z": 7,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "planned project"
          },
          ".tokens > circle": {
            "fill": "#7a7e9b"
          },
          ".alot > text": {
            "fill": "#7a7e9b",
            "font-family": "Courier New",
            "font-size": 20,
            "font-weight": "bold",
            "ref-x": 0,
            "ref-y": 0,
            "y-alignment": -0.2
          }
        }
      },
      {
        "type": "pn.Place",
        "size": {
          "width": 50,
          "height": 50
        },
        "position": {
          "x": 696,
          "y": 24
        },
        "angle": 0,
        "tokens": 0,
        "id": "4afa856d-8026-444e-adbf-4361dee07b14",
        "jsonnetsType": "place",
        "z": 8,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "running project"
          },
          ".tokens > circle": {
            "fill": "#7a7e9b"
          },
          ".alot > text": {
            "fill": "#7a7e9b",
            "font-family": "Courier New",
            "font-size": 20,
            "font-weight": "bold",
            "ref-x": 0,
            "ref-y": 0,
            "y-alignment": -0.2
          }
        }
      },
      {
        "type": "pn.Place",
        "size": {
          "width": 50,
          "height": 50
        },
        "position": {
          "x": 1044,
          "y": 24
        },
        "angle": 0,
        "tokens": 0,
        "id": "8faee6b2-4bac-4122-8f8f-9288c7d620d4",
        "jsonnetsType": "place",
        "z": 9,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "finished project"
          },
          ".tokens > circle": {
            "fill": "#7a7e9b"
          },
          ".alot > text": {
            "fill": "#7a7e9b",
            "font-family": "Courier New",
            "font-size": 20,
            "font-weight": "bold",
            "ref-x": 0,
            "ref-y": 0,
            "y-alignment": -0.2
          }
        }
      },
      {
        "type": "pn.Place",
        "size": {
          "width": 50,
          "height": 50
        },
        "position": {
          "x": 876,
          "y": 216
        },
        "angle": 0,
        "tokens": 1,
        "id": "8fb8aeea-41fb-4b94-9b3f-a11db064d29b",
        "jsonnetsType": "place",
        "z": 10,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "lesson learned"
          },
          ".tokens > circle": {
            "fill": "#7a7e9b"
          },
          ".alot > text": {
            "fill": "#7a7e9b",
            "font-family": "Courier New",
            "font-size": 20,
            "font-weight": "bold",
            "ref-x": 0,
            "ref-y": 0,
            "y-alignment": -0.2
          }
        }
      },
      {
        "type": "pn.Place",
        "size": {
          "width": 50,
          "height": 50
        },
        "position": {
          "x": 348,
          "y": 360
        },
        "angle": 0,
        "tokens": 0,
        "id": "51af7a83-4909-4ea0-a925-4c386e9c5582",
        "jsonnetsType": "place",
        "z": 11,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "employee"
          },
          ".tokens > circle": {
            "fill": "#7a7e9b"
          },
          ".alot > text": {
            "fill": "#7a7e9b",
            "font-family": "Courier New",
            "font-size": 20,
            "font-weight": "bold",
            "ref-x": 0,
            "ref-y": 0,
            "y-alignment": -0.2
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "8ebec2fa-d25c-4a6d-a458-154333851a62",
          "selector": ".root"
        },
        "target": {
          "id": "ceef5696-f9be-48c3-9222-34711b487bf8",
          "selector": ".root"
        },
        "id": "c502fcbe-ec0e-4170-acf1-f7d4f915150d",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 12,
        "vertices": [],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "ceef5696-f9be-48c3-9222-34711b487bf8",
          "selector": ".root"
        },
        "target": {
          "id": "cbd21014-6ddd-48b2-bb71-73d6f73a1b2d",
          "selector": ".root"
        },
        "id": "9444e7a3-38fd-4392-ba4e-c7ad0a1274b6",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 13,
        "vertices": [],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "cbd21014-6ddd-48b2-bb71-73d6f73a1b2d",
          "selector": ".root"
        },
        "target": {
          "id": "be1b5311-0352-4159-954c-0366da8f31fc",
          "selector": ".root"
        },
        "id": "40f4b2ff-02a8-4d87-9708-740a63b285ef",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 14,
        "vertices": [],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "be1b5311-0352-4159-954c-0366da8f31fc",
          "selector": ".root"
        },
        "target": {
          "id": "4afa856d-8026-444e-adbf-4361dee07b14",
          "selector": ".root"
        },
        "id": "e39ac192-7156-4f6f-b418-69fd3a6e0de1",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 15,
        "vertices": [],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "4afa856d-8026-444e-adbf-4361dee07b14",
          "selector": ".root"
        },
        "target": {
          "id": "4c9cbf53-2412-4844-9869-a188e913adff",
          "selector": ".root"
        },
        "id": "5b9ce254-cf34-421e-a5ab-8cb0ef195b59",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 16,
        "vertices": [],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "4c9cbf53-2412-4844-9869-a188e913adff",
          "selector": ".root"
        },
        "target": {
          "id": "8faee6b2-4bac-4122-8f8f-9288c7d620d4",
          "selector": ".root"
        },
        "id": "94305b62-c3c5-471d-9cc7-f6585eadcedd",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 17,
        "vertices": [],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "0704140a-ccc3-436b-99ea-54ae79e822e9",
          "selector": ".root"
        },
        "target": {
          "id": "cbd21014-6ddd-48b2-bb71-73d6f73a1b2d",
          "selector": ".root"
        },
        "id": "5721946a-1a1f-4225-b63a-789fef3a7428",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 18,
        "vertices": [
          {
            "x": 396,
            "y": 156
          }
        ],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "0704140a-ccc3-436b-99ea-54ae79e822e9",
          "selector": ".root"
        },
        "target": {
          "id": "51af7a83-4909-4ea0-a925-4c386e9c5582",
          "selector": ".root"
        },
        "id": "d2fad06e-e996-4b74-a573-c1f2ab0b9183",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 19,
        "vertices": [],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "51af7a83-4909-4ea0-a925-4c386e9c5582",
          "selector": ".root"
        },
        "target": {
          "id": "5a720469-21f0-4789-afba-bfe43be6bb9a",
          "selector": ".root"
        },
        "id": "96d4bd52-de50-4314-8c8b-82b310d77451",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 20,
        "vertices": [
          {
            "x": 612,
            "y": 360
          }
        ],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "5a720469-21f0-4789-afba-bfe43be6bb9a",
          "selector": ".root"
        },
        "target": {
          "id": "51af7a83-4909-4ea0-a925-4c386e9c5582",
          "selector": ".root"
        },
        "id": "c194a9df-44ab-484d-8682-38b3488e86e0",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 21,
        "vertices": [
          {
            "x": 612,
            "y": 420
          }
        ],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "4c9cbf53-2412-4844-9869-a188e913adff",
          "selector": ".root"
        },
        "target": {
          "id": "8fb8aeea-41fb-4b94-9b3f-a11db064d29b",
          "selector": ".root"
        },
        "id": "a8a10fb2-38fc-4b55-9603-153d99406076",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 22,
        "vertices": [],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "8fb8aeea-41fb-4b94-9b3f-a11db064d29b",
          "selector": ".root"
        },
        "target": {
          "id": "5a720469-21f0-4789-afba-bfe43be6bb9a",
          "selector": ".root"
        },
        "id": "5b1f42b0-bf49-4343-bcb4-cafef2a3895f",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 23,
        "vertices": [],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "cbd21014-6ddd-48b2-bb71-73d6f73a1b2d",
          "selector": ".root"
        },
        "target": {
          "id": "0704140a-ccc3-436b-99ea-54ae79e822e9",
          "selector": ".root"
        },
        "id": "c2df2460-099c-4401-b2c7-916060339394",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 24,
        "vertices": [
          {
            "x": 348,
            "y": 144
          }
        ],
        "attrs": {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#4b4a67"
          }
        }
      }
    ]
  }
}