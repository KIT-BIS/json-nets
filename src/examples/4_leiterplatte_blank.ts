export const data = {
  "netData": {
    "places": [
      {
        "id": "5309778c-2f6a-44c0-aa17-bb3f15b7a606",
        "name": "Start",
        "marking": [
          {
            "amount": 1,
            "ghgFactor": 0,
            "scope": "start",
            "pds": 0
          }
        ],
        "schema": {
          "type": "array",
          "title": "start",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "5309778c-2f6a-44c0-aa17-bb3f15b7a606"
        }
      },
      {
        "id": "b1987eda-8e08-4ced-b830-b6567f952ded",
        "name": "p1",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "b1987eda-8e08-4ced-b830-b6567f952ded"
        }
      },
      {
        "id": "f08869f7-1c58-44f1-a0ee-51f8d948856c",
        "name": "p2",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "f08869f7-1c58-44f1-a0ee-51f8d948856c"
        }
      },
      {
        "id": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448",
        "name": "p3",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448"
        }
      },
      {
        "id": "487ea0ae-a4de-43e7-bb49-5953c547398b",
        "name": "p4",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "487ea0ae-a4de-43e7-bb49-5953c547398b"
        }
      },
      {
        "id": "d312e07b-ebb7-4901-baa3-4685f2ebff45",
        "name": "p5",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "d312e07b-ebb7-4901-baa3-4685f2ebff45"
        }
      },
      {
        "id": "d779b8e0-9388-4502-971c-bf3b4addc44e",
        "name": "p6",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "d779b8e0-9388-4502-971c-bf3b4addc44e"
        }
      },
      {
        "id": "257dbecb-8cf9-4411-8f95-1c787c8333c4",
        "name": "p7",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "257dbecb-8cf9-4411-8f95-1c787c8333c4"
        }
      },
      {
        "id": "6032860d-f236-4f7e-8be7-197934f4114b",
        "name": "p9",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "6032860d-f236-4f7e-8be7-197934f4114b"
        }
      },
      {
        "id": "2575f3d8-5e2b-41d6-ad8f-0d085c266c07",
        "name": "Leiterplatte",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "end",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "2575f3d8-5e2b-41d6-ad8f-0d085c266c07"
        }
      },
      {
        "id": "f5cf8f49-6389-4307-8c11-579e41685514",
        "name": "p8",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "f5cf8f49-6389-4307-8c11-579e41685514"
        }
      }
    ],
    "transitions": [
      {
        "id": "24b114f0-0cf6-4cac-9aad-e034420f35e3",
        "name": "Lagenaufbau",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p1_key": "local output_p1_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p1_value": "local output_p1_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "ad131bbd-9f06-450f-92a9-02a23ff57dc9",
        "name": "Laminieren",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p2_key": "local output_p2_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p2_value": "local output_p2_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "282fe852-ee69-4f85-93c7-b8b2a3aabe06",
        "name": "Bohren",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p3_key": "local output_p3_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p3_value": "local output_p3_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "c7c6e86a-5446-4ef5-ba45-d4547bff759d",
        "name": "Plating",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p4_key": "local output_p4_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p4_value": "local output_p4_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "cdfc3613-646a-45d2-80ff-d1a05eef5867",
        "name": "Lötstoppmaske",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p5_key": "local output_p5_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p5_value": "local output_p5_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "5b35b671-368c-42fc-8f5e-55acbe10d9de",
        "name": "Lithografie",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p6_key": "local output_p6_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p6_value": "local output_p6_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "5ae74711-b66a-4d67-831d-c69f190f6117",
        "name": "Nachbearbeiten",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p7_key": "local output_p7_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p7_value": "local output_p7_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "f73a9c93-3918-4ec1-9418-4c7ee1e4e1f0",
        "name": "Testen",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p8_key": "local output_p8_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p8_value": "local output_p8_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "cb95ac77-e8db-4099-8e29-4ac3121c2878",
        "name": "Oberflächenfinish",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p9_key": "local output_p9_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p9_value": "local output_p9_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "6c5f99f4-2b10-4dd9-8427-bd2bd18696a1",
        "name": "Legendendruck",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_leiterplatte_key": "local output_leiterplatte_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_leiterplatte_value": "local output_leiterplatte_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      }
    ],
    "arcs": [
      {
        "id": "ebc2cbb5-32c4-4d19-ae03-a525b2cafe46",
        "filter": "$.*",
        "fromId": "5309778c-2f6a-44c0-aa17-bb3f15b7a606",
        "toId": "24b114f0-0cf6-4cac-9aad-e034420f35e3"
      },
      {
        "id": "189b44da-07d6-4bf6-9512-b47cc9a673f7",
        "filter": "$",
        "fromId": "24b114f0-0cf6-4cac-9aad-e034420f35e3",
        "toId": "b1987eda-8e08-4ced-b830-b6567f952ded"
      },
      {
        "id": "394700a9-4fa6-4f52-b5c5-a1ec92fbf559",
        "filter": "$.*",
        "fromId": "b1987eda-8e08-4ced-b830-b6567f952ded",
        "toId": "ad131bbd-9f06-450f-92a9-02a23ff57dc9"
      },
      {
        "id": "663eb46f-5c4e-4050-a69d-ebc8c7d17f6f",
        "filter": "$",
        "fromId": "ad131bbd-9f06-450f-92a9-02a23ff57dc9",
        "toId": "f08869f7-1c58-44f1-a0ee-51f8d948856c"
      },
      {
        "id": "8eb7b925-fd54-489c-9a8b-8c5034a857bf",
        "filter": "$.*",
        "fromId": "f08869f7-1c58-44f1-a0ee-51f8d948856c",
        "toId": "282fe852-ee69-4f85-93c7-b8b2a3aabe06"
      },
      {
        "id": "33c16aeb-6a8c-407c-b847-00e69c01c724",
        "filter": "$",
        "fromId": "282fe852-ee69-4f85-93c7-b8b2a3aabe06",
        "toId": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448"
      },
      {
        "id": "ea62e657-95a9-4e5f-97d7-ab9d18e9966d",
        "filter": "$.*",
        "fromId": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448",
        "toId": "c7c6e86a-5446-4ef5-ba45-d4547bff759d"
      },
      {
        "id": "0d1cd340-ac29-415b-bf07-c97c8dd2144c",
        "filter": "$",
        "fromId": "c7c6e86a-5446-4ef5-ba45-d4547bff759d",
        "toId": "487ea0ae-a4de-43e7-bb49-5953c547398b"
      },
      {
        "id": "ecd4967b-149e-4db8-adbb-ecbe792c50b8",
        "filter": "$.*",
        "fromId": "487ea0ae-a4de-43e7-bb49-5953c547398b",
        "toId": "cdfc3613-646a-45d2-80ff-d1a05eef5867"
      },
      {
        "id": "8d9fb05d-0763-4c85-b354-d5cd9f5e2c71",
        "filter": "$",
        "fromId": "cdfc3613-646a-45d2-80ff-d1a05eef5867",
        "toId": "d312e07b-ebb7-4901-baa3-4685f2ebff45"
      },
      {
        "id": "1cbde8e6-32f6-45e5-a766-b144951b18fc",
        "filter": "$.*",
        "fromId": "d312e07b-ebb7-4901-baa3-4685f2ebff45",
        "toId": "5b35b671-368c-42fc-8f5e-55acbe10d9de"
      },
      {
        "id": "33ad877d-e190-4b1c-8c08-994cfb8057fb",
        "filter": "$",
        "fromId": "5b35b671-368c-42fc-8f5e-55acbe10d9de",
        "toId": "d779b8e0-9388-4502-971c-bf3b4addc44e"
      },
      {
        "id": "b7df865d-b5f2-4daf-9939-eb6605863784",
        "filter": "$.*",
        "fromId": "d779b8e0-9388-4502-971c-bf3b4addc44e",
        "toId": "5ae74711-b66a-4d67-831d-c69f190f6117"
      },
      {
        "id": "6a9ed89c-33f7-4132-89db-a3f4aa9706a7",
        "filter": "$",
        "fromId": "5ae74711-b66a-4d67-831d-c69f190f6117",
        "toId": "257dbecb-8cf9-4411-8f95-1c787c8333c4"
      },
      {
        "id": "6eab3779-35ef-4ca2-a4ff-ec648fde309a",
        "filter": "$.*",
        "fromId": "257dbecb-8cf9-4411-8f95-1c787c8333c4",
        "toId": "f73a9c93-3918-4ec1-9418-4c7ee1e4e1f0"
      },
      {
        "id": "2899503b-e44b-4994-8705-34d457f601fc",
        "filter": "$",
        "fromId": "f73a9c93-3918-4ec1-9418-4c7ee1e4e1f0",
        "toId": "f5cf8f49-6389-4307-8c11-579e41685514"
      },
      {
        "id": "a019943d-d5e9-4a95-9172-5f7fb1564528",
        "filter": "$.*",
        "fromId": "f5cf8f49-6389-4307-8c11-579e41685514",
        "toId": "cb95ac77-e8db-4099-8e29-4ac3121c2878"
      },
      {
        "id": "12d77567-c04b-4668-a54c-cd27c8700f54",
        "filter": "$",
        "fromId": "cb95ac77-e8db-4099-8e29-4ac3121c2878",
        "toId": "6032860d-f236-4f7e-8be7-197934f4114b"
      },
      {
        "id": "71278fb4-3e78-421a-98d2-8e0fe0c1046f",
        "filter": "$.*",
        "fromId": "6032860d-f236-4f7e-8be7-197934f4114b",
        "toId": "6c5f99f4-2b10-4dd9-8427-bd2bd18696a1"
      },
      {
        "id": "fb9cf236-7666-4473-9c86-9a8679a003b3",
        "filter": "$",
        "fromId": "6c5f99f4-2b10-4dd9-8427-bd2bd18696a1",
        "toId": "2575f3d8-5e2b-41d6-ad8f-0d085c266c07"
      }
    ]
  },
  "layoutData": {
    "cells": [
      {
        "type": "pn.Place",
        "size": {
          "width": 50,
          "height": 50
        },
        "position": {
          "x": 108,
          "y": 276
        },
        "angle": 0,
        "tokens": 1,
        "id": "5309778c-2f6a-44c0-aa17-bb3f15b7a606",
        "jsonnetsType": "place",
        "z": 11,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "Start"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 480,
          "y": 276
        },
        "angle": 0,
        "tokens": 0,
        "id": "b1987eda-8e08-4ced-b830-b6567f952ded",
        "jsonnetsType": "place",
        "z": 12,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "p1"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 888,
          "y": 276
        },
        "angle": 0,
        "tokens": 0,
        "id": "f08869f7-1c58-44f1-a0ee-51f8d948856c",
        "jsonnetsType": "place",
        "z": 13,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "p2"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 1344,
          "y": 276
        },
        "angle": 0,
        "tokens": 0,
        "id": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448",
        "jsonnetsType": "place",
        "z": 14,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "p3"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 1344,
          "y": 564
        },
        "angle": 0,
        "tokens": 0,
        "id": "487ea0ae-a4de-43e7-bb49-5953c547398b",
        "jsonnetsType": "place",
        "z": 15,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "p4"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "y": 564
        },
        "angle": 0,
        "tokens": 0,
        "id": "d312e07b-ebb7-4901-baa3-4685f2ebff45",
        "jsonnetsType": "place",
        "z": 16,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "p5"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 468,
          "y": 564
        },
        "angle": 0,
        "tokens": 0,
        "id": "d779b8e0-9388-4502-971c-bf3b4addc44e",
        "jsonnetsType": "place",
        "z": 17,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "p6"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 96,
          "y": 564
        },
        "angle": 0,
        "tokens": 0,
        "id": "257dbecb-8cf9-4411-8f95-1c787c8333c4",
        "jsonnetsType": "place",
        "z": 18,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "p7"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 480,
          "y": 912
        },
        "angle": 0,
        "tokens": 0,
        "id": "6032860d-f236-4f7e-8be7-197934f4114b",
        "jsonnetsType": "place",
        "z": 19,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "p9"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "y": 912
        },
        "angle": 0,
        "tokens": 0,
        "id": "2575f3d8-5e2b-41d6-ad8f-0d085c266c07",
        "jsonnetsType": "place",
        "z": 20,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "Leiterplatte"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 96,
          "y": 912
        },
        "angle": 0,
        "tokens": 0,
        "id": "f5cf8f49-6389-4307-8c11-579e41685514",
        "jsonnetsType": "place",
        "z": 21,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "p8"
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
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 275,
          "y": 275
        },
        "angle": 0,
        "id": "24b114f0-0cf6-4cac-9aad-e034420f35e3",
        "jsonnetsType": "transition",
        "z": 22,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Lagenaufbau"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 648,
          "y": 276
        },
        "angle": 0,
        "id": "ad131bbd-9f06-450f-92a9-02a23ff57dc9",
        "jsonnetsType": "transition",
        "z": 23,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Laminieren"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 1068,
          "y": 276
        },
        "angle": 0,
        "id": "282fe852-ee69-4f85-93c7-b8b2a3aabe06",
        "jsonnetsType": "transition",
        "z": 24,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Bohren"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 1320,
          "y": 420
        },
        "angle": 0,
        "id": "c7c6e86a-5446-4ef5-ba45-d4547bff759d",
        "jsonnetsType": "transition",
        "z": 25,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Plating"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 1068,
          "y": 564
        },
        "angle": 0,
        "id": "cdfc3613-646a-45d2-80ff-d1a05eef5867",
        "jsonnetsType": "transition",
        "z": 26,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Lötstoppmaske"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 648,
          "y": 564
        },
        "angle": 0,
        "id": "5b35b671-368c-42fc-8f5e-55acbe10d9de",
        "jsonnetsType": "transition",
        "z": 27,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Lithografie"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 264,
          "y": 564
        },
        "angle": 0,
        "id": "5ae74711-b66a-4d67-831d-c69f190f6117",
        "jsonnetsType": "transition",
        "z": 28,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Nachbearbeiten"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 72,
          "y": 744
        },
        "angle": 0,
        "id": "f73a9c93-3918-4ec1-9418-4c7ee1e4e1f0",
        "jsonnetsType": "transition",
        "z": 29,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Testen"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 252,
          "y": 912
        },
        "angle": 0,
        "id": "cb95ac77-e8db-4099-8e29-4ac3121c2878",
        "jsonnetsType": "transition",
        "z": 30,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Oberflächenfinish"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
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
          "x": 648,
          "y": 912
        },
        "angle": 0,
        "id": "6c5f99f4-2b10-4dd9-8427-bd2bd18696a1",
        "jsonnetsType": "transition",
        "z": 31,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Legendendruck"
          },
          ".root": {
            "fill": "hsl(204, 71%, 39%)",
            "stroke": "hsl(0, 0%, 21%)"
          },
          "body": {
            "cursor": "auto"
          },
          "label": {
            "cursor": "auto"
          }
        }
      },
      {
        "type": "standard.Link",
        "source": {
          "id": "5309778c-2f6a-44c0-aa17-bb3f15b7a606",
          "selector": ".root"
        },
        "target": {
          "id": "24b114f0-0cf6-4cac-9aad-e034420f35e3",
          "selector": ".root"
        },
        "id": "ebc2cbb5-32c4-4d19-ae03-a525b2cafe46",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 32,
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
          "id": "24b114f0-0cf6-4cac-9aad-e034420f35e3",
          "selector": ".root"
        },
        "target": {
          "id": "b1987eda-8e08-4ced-b830-b6567f952ded",
          "selector": ".root"
        },
        "id": "189b44da-07d6-4bf6-9512-b47cc9a673f7",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 33,
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
          "id": "b1987eda-8e08-4ced-b830-b6567f952ded",
          "selector": ".root"
        },
        "target": {
          "id": "ad131bbd-9f06-450f-92a9-02a23ff57dc9",
          "selector": ".root"
        },
        "id": "394700a9-4fa6-4f52-b5c5-a1ec92fbf559",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 34,
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
          "id": "ad131bbd-9f06-450f-92a9-02a23ff57dc9",
          "selector": ".root"
        },
        "target": {
          "id": "f08869f7-1c58-44f1-a0ee-51f8d948856c",
          "selector": ".root"
        },
        "id": "663eb46f-5c4e-4050-a69d-ebc8c7d17f6f",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 35,
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
          "id": "f08869f7-1c58-44f1-a0ee-51f8d948856c",
          "selector": ".root"
        },
        "target": {
          "id": "282fe852-ee69-4f85-93c7-b8b2a3aabe06",
          "selector": ".root"
        },
        "id": "8eb7b925-fd54-489c-9a8b-8c5034a857bf",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 36,
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
          "id": "282fe852-ee69-4f85-93c7-b8b2a3aabe06",
          "selector": ".root"
        },
        "target": {
          "id": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448",
          "selector": ".root"
        },
        "id": "33c16aeb-6a8c-407c-b847-00e69c01c724",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 37,
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
          "id": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448",
          "selector": ".root"
        },
        "target": {
          "id": "c7c6e86a-5446-4ef5-ba45-d4547bff759d",
          "selector": ".root"
        },
        "id": "ea62e657-95a9-4e5f-97d7-ab9d18e9966d",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 38,
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
          "id": "c7c6e86a-5446-4ef5-ba45-d4547bff759d",
          "selector": ".root"
        },
        "target": {
          "id": "487ea0ae-a4de-43e7-bb49-5953c547398b",
          "selector": ".root"
        },
        "id": "0d1cd340-ac29-415b-bf07-c97c8dd2144c",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 39,
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
          "id": "487ea0ae-a4de-43e7-bb49-5953c547398b",
          "selector": ".root"
        },
        "target": {
          "id": "cdfc3613-646a-45d2-80ff-d1a05eef5867",
          "selector": ".root"
        },
        "id": "ecd4967b-149e-4db8-adbb-ecbe792c50b8",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 40,
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
          "id": "cdfc3613-646a-45d2-80ff-d1a05eef5867",
          "selector": ".root"
        },
        "target": {
          "id": "d312e07b-ebb7-4901-baa3-4685f2ebff45",
          "selector": ".root"
        },
        "id": "8d9fb05d-0763-4c85-b354-d5cd9f5e2c71",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 41,
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
          "id": "d312e07b-ebb7-4901-baa3-4685f2ebff45",
          "selector": ".root"
        },
        "target": {
          "id": "5b35b671-368c-42fc-8f5e-55acbe10d9de",
          "selector": ".root"
        },
        "id": "1cbde8e6-32f6-45e5-a766-b144951b18fc",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 42,
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
          "id": "5b35b671-368c-42fc-8f5e-55acbe10d9de",
          "selector": ".root"
        },
        "target": {
          "id": "d779b8e0-9388-4502-971c-bf3b4addc44e",
          "selector": ".root"
        },
        "id": "33ad877d-e190-4b1c-8c08-994cfb8057fb",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 43,
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
          "id": "d779b8e0-9388-4502-971c-bf3b4addc44e",
          "selector": ".root"
        },
        "target": {
          "id": "5ae74711-b66a-4d67-831d-c69f190f6117",
          "selector": ".root"
        },
        "id": "b7df865d-b5f2-4daf-9939-eb6605863784",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 44,
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
          "id": "5ae74711-b66a-4d67-831d-c69f190f6117",
          "selector": ".root"
        },
        "target": {
          "id": "257dbecb-8cf9-4411-8f95-1c787c8333c4",
          "selector": ".root"
        },
        "id": "6a9ed89c-33f7-4132-89db-a3f4aa9706a7",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 45,
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
          "id": "257dbecb-8cf9-4411-8f95-1c787c8333c4",
          "selector": ".root"
        },
        "target": {
          "id": "f73a9c93-3918-4ec1-9418-4c7ee1e4e1f0",
          "selector": ".root"
        },
        "id": "6eab3779-35ef-4ca2-a4ff-ec648fde309a",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 46,
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
          "id": "f73a9c93-3918-4ec1-9418-4c7ee1e4e1f0",
          "selector": ".root"
        },
        "target": {
          "id": "f5cf8f49-6389-4307-8c11-579e41685514",
          "selector": ".root"
        },
        "id": "2899503b-e44b-4994-8705-34d457f601fc",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 47,
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
          "id": "f5cf8f49-6389-4307-8c11-579e41685514",
          "selector": ".root"
        },
        "target": {
          "id": "cb95ac77-e8db-4099-8e29-4ac3121c2878",
          "selector": ".root"
        },
        "id": "a019943d-d5e9-4a95-9172-5f7fb1564528",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 48,
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
          "id": "cb95ac77-e8db-4099-8e29-4ac3121c2878",
          "selector": ".root"
        },
        "target": {
          "id": "6032860d-f236-4f7e-8be7-197934f4114b",
          "selector": ".root"
        },
        "id": "12d77567-c04b-4668-a54c-cd27c8700f54",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 49,
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
          "id": "6032860d-f236-4f7e-8be7-197934f4114b",
          "selector": ".root"
        },
        "target": {
          "id": "6c5f99f4-2b10-4dd9-8427-bd2bd18696a1",
          "selector": ".root"
        },
        "id": "71278fb4-3e78-421a-98d2-8e0fe0c1046f",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 50,
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
          "id": "6c5f99f4-2b10-4dd9-8427-bd2bd18696a1",
          "selector": ".root"
        },
        "target": {
          "id": "2575f3d8-5e2b-41d6-ad8f-0d085c266c07",
          "selector": ".root"
        },
        "id": "fb9cf236-7666-4473-9c86-9a8679a003b3",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 51,
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