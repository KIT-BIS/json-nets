export const data = {
  "netData": {
    "places": [
      {
        "id": "bf3fa260-01c9-405f-8ce4-5fa1d50b63bd",
        "name": "Component",
        "marking": [
          {
            "name": "RAM",
            "carbonFootprint": 110,
            "unit": "kgCO2eq"
          },
          {
            "name": "RAM",
            "carbonFootprint": 110,
            "unit": "kgCO2eq"
          }
        ],
        "schema": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "carbonFootprint": {
              "type": "number"
            },
            "unit": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "carbonFootprint",
            "unit"
          ]
        }
      },
      {
        "id": "ba181779-5f73-46fc-b43d-522240f98aa1",
        "name": "Product",
        "marking": [
          {
            "orderRef": 1,
            "name": "Server X3000",
            "totalEmissions": 0,
            "components": []
          },
          {
            "orderRef": 3,
            "name": "Server X5000",
            "totalEmissions": 0,
            "components": []
          }
        ],
        "schema": {
          "type": "object",
          "properties": {
            "orderRef": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "totalEmissions": {
              "type": "number"
            },
            "components": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "orderRef",
            "name",
            "totalEmissions",
            "components"
          ]
        }
      },
      {
        "id": "57a12cb8-6a4d-44ae-82fa-5703b2ffb2dc",
        "name": "Order",
        "marking": [
          {
            "orderId": 1,
            "name": "Server X3000",
            "positions": [
              {
                "name": "SSD",
                "qty": 10
              },
              {
                "name": "RAM",
                "qty": 4
              },
              {
                "name": "CPU",
                "qty": 2
              }
            ]
          },
          {
            "orderId": 2,
            "name": "Server X2000",
            "positions": [
              {
                "name": "SSD",
                "qty": 5
              },
              {
                "name": "RAM",
                "qty": 1
              },
              {
                "name": "CPU",
                "qty": 1
              }
            ]
          }
        ],
        "schema": {
          "type": "object",
          "properties": {
            "orderId": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "positions": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "qty": {
                    "type": "number"
                  }
                },
                "required": [
                  "name",
                  "qty"
                ]
              }
            }
          },
          "required": [
            "orderId",
            "name",
            "positions"
          ]
        }
      },
      {
        "id": "354bc422-60d9-40ca-a544-9e3f004aeb17",
        "name": "Energy",
        "marking": [
          {
            "emissions": 10,
            "unit": "kgCO2eq"
          },
          {
            "emissions": 10,
            "unit": "kgCO2eq"
          },
          {
            "emissions": 10,
            "unit": "kgCO2eq"
          },
          {
            "emissions": 10,
            "unit": "kgCO2eq"
          },
          {
            "emissions": 10,
            "unit": "kgCO2eq"
          },
          {
            "emissions": 10,
            "unit": "kgCO2eq"
          }
        ],
        "schema": {
          "type": "object",
          "properties": {
            "emissions": {
              "type": "number"
            },
            "unit": {
              "type": "string"
            }
          },
          "required": [
            "emissions",
            "unit"
          ]
        }
      }
    ],
    "transitions": [
      {
        "id": "cecb8d48-a308-4f65-acc4-d11b6338e394",
        "name": "Assemble Product",
        "preface": "",
        "guard": "input_Order_token == output_Order_token   \n&& input_Order_token.orderId == output_Order_token.orderId \n&& input_Order_value.qty > 1  ",
        "keyVarSnippets": {
          "output_Product_key": "local output_Product_key = input_Product_key;",
          "output_Order_key": "local output_Order_key = input_Product_key;"
        },
        "fragmentVarSnippets": {
          "output_Product_value": "local output_Product_value = input_Product_value + {\ntotalEmissions: input_Product_value.totalEmissions + input_Component_value.carbonFootprint,\ncomponents: input_Product_value.components + [input_Component_value.name]\n};",
          "output_Order_value": "local output_Order_value = input_Order_value + { qty: input_Order_value.qty - 1};"
        }
      }
    ],
    "arcs": [
      {
        "id": "6e37ad49-34bc-4baa-ab05-7e94f35e3dda",
        "filter": "$.*",
        "fromId": "bf3fa260-01c9-405f-8ce4-5fa1d50b63bd",
        "toId": "cecb8d48-a308-4f65-acc4-d11b6338e394"
      },
      {
        "id": "8b990fca-324f-4723-9815-8861ebf9b2fd",
        "filter": "$.*.positions.*",
        "fromId": "57a12cb8-6a4d-44ae-82fa-5703b2ffb2dc",
        "toId": "cecb8d48-a308-4f65-acc4-d11b6338e394"
      },
      {
        "id": "50b6bcdc-4a9f-4648-802c-b8637a504705",
        "filter": "$.*",
        "fromId": "354bc422-60d9-40ca-a544-9e3f004aeb17",
        "toId": "cecb8d48-a308-4f65-acc4-d11b6338e394"
      },
      {
        "id": "3bb8b09b-88b0-4cc6-850a-eb1e15091e43",
        "filter": "$",
        "fromId": "cecb8d48-a308-4f65-acc4-d11b6338e394",
        "toId": "ba181779-5f73-46fc-b43d-522240f98aa1"
      },
      {
        "id": "1cc9edfb-25e3-4b37-ba9f-149025cc6eda",
        "filter": "$.*.positions",
        "fromId": "cecb8d48-a308-4f65-acc4-d11b6338e394",
        "toId": "57a12cb8-6a4d-44ae-82fa-5703b2ffb2dc"
      },
      {
        "id": "58c0500f-dcc2-4ac8-b780-334d160739a2",
        "filter": "$.*",
        "fromId": "ba181779-5f73-46fc-b43d-522240f98aa1",
        "toId": "cecb8d48-a308-4f65-acc4-d11b6338e394"
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
          "x": 156,
          "y": 144
        },
        "angle": 0,
        "id": "cecb8d48-a308-4f65-acc4-d11b6338e394",
        "jsonnetsType": "transition",
        "z": 1,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Assemble Product"
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
          "x": 72,
          "y": 264
        },
        "angle": 0,
        "tokens": 2,
        "id": "bf3fa260-01c9-405f-8ce4-5fa1d50b63bd",
        "jsonnetsType": "place",
        "z": 2,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "Component"
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
          "x": 360,
          "y": 144
        },
        "angle": 0,
        "tokens": 2,
        "id": "ba181779-5f73-46fc-b43d-522240f98aa1",
        "jsonnetsType": "place",
        "z": 3,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "Product"
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
          "x": 0,
          "y": 144
        },
        "angle": 0,
        "tokens": 2,
        "id": "57a12cb8-6a4d-44ae-82fa-5703b2ffb2dc",
        "jsonnetsType": "place",
        "z": 4,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "Order"
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
          "x": 288,
          "y": 264
        },
        "angle": 0,
        "tokens": 6,
        "id": "354bc422-60d9-40ca-a544-9e3f004aeb17",
        "jsonnetsType": "place",
        "z": 5,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "Energy"
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
          "id": "bf3fa260-01c9-405f-8ce4-5fa1d50b63bd",
          "selector": ".root"
        },
        "target": {
          "id": "cecb8d48-a308-4f65-acc4-d11b6338e394",
          "selector": ".root"
        },
        "id": "6e37ad49-34bc-4baa-ab05-7e94f35e3dda",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 6,
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
          "id": "57a12cb8-6a4d-44ae-82fa-5703b2ffb2dc",
          "selector": ".root"
        },
        "target": {
          "id": "cecb8d48-a308-4f65-acc4-d11b6338e394",
          "selector": ".root"
        },
        "id": "8b990fca-324f-4723-9815-8861ebf9b2fd",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 7,
        "vertices": [
          {
            "x": 72,
            "y": 192
          },
          {
            "x": 132,
            "y": 192
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
          "id": "354bc422-60d9-40ca-a544-9e3f004aeb17",
          "selector": ".root"
        },
        "target": {
          "id": "cecb8d48-a308-4f65-acc4-d11b6338e394",
          "selector": ".root"
        },
        "id": "50b6bcdc-4a9f-4648-802c-b8637a504705",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 8,
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
          "id": "cecb8d48-a308-4f65-acc4-d11b6338e394",
          "selector": ".root"
        },
        "target": {
          "id": "ba181779-5f73-46fc-b43d-522240f98aa1",
          "selector": ".root"
        },
        "id": "3bb8b09b-88b0-4cc6-850a-eb1e15091e43",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 9,
        "vertices": [
          {
            "x": 288,
            "y": 192
          },
          {
            "x": 324,
            "y": 192
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
          "id": "cecb8d48-a308-4f65-acc4-d11b6338e394",
          "selector": ".root"
        },
        "target": {
          "id": "57a12cb8-6a4d-44ae-82fa-5703b2ffb2dc",
          "selector": ".root"
        },
        "id": "1cc9edfb-25e3-4b37-ba9f-149025cc6eda",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 10,
        "vertices": [
          {
            "x": 132,
            "y": 144
          },
          {
            "x": 72,
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
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "ba181779-5f73-46fc-b43d-522240f98aa1",
          "selector": ".root"
        },
        "target": {
          "id": "cecb8d48-a308-4f65-acc4-d11b6338e394",
          "selector": ".root"
        },
        "id": "58c0500f-dcc2-4ac8-b780-334d160739a2",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 11,
        "vertices": [
          {
            "x": 336,
            "y": 144
          },
          {
            "x": 288,
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