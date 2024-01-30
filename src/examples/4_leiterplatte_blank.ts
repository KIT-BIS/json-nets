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
        "id": "ebf2fff0-519c-468e-86d3-ef7959ab78ef",
        "name": "Lagenaufbau",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p1_key": "local output_p1_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p1_value": "local output_p1_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "472fc7ef-856e-4c3f-811f-21e83e610f6e",
        "name": "Laminieren",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p2_key": "local output_p2_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p2_value": "local output_p2_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "6d92700a-bc7d-433b-b31b-2f4aeba310ae",
        "name": "Bohren",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p3_key": "local output_p3_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p3_value": "local output_p3_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "070c31ef-4141-4dd2-8e16-3e353cf2b119",
        "name": "Plating",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p4_key": "local output_p4_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p4_value": "local output_p4_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "80911f5a-d432-46cb-9268-0ea56a284add",
        "name": "Lötstoppmaske",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p5_key": "local output_p5_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p5_value": "local output_p5_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "986bafab-e88d-449f-9591-106351309bd6",
        "name": "Lithografie",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p6_key": "local output_p6_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p6_value": "local output_p6_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "4265e96e-df3e-46fd-b0b7-4637272f776b",
        "name": "Nachbearbeitung",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p7_key": "local output_p7_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p7_value": "local output_p7_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "958ce812-8c2e-44d7-b6fb-a52312bc8ce0",
        "name": "Test",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p8_key": "local output_p8_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p8_value": "local output_p8_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "a46e1683-8427-4ec3-b4cd-04251579c484",
        "name": "Oberflächenfinish",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_p9_key": "local output_p9_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_p9_value": "local output_p9_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      },
      {
        "id": "e370bc9a-0646-4ba5-9a70-01bb6b687e48",
        "name": "Legendendruck",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_leiterplatte_key": "local output_leiterplatte_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_leiterplatte_value": "local output_leiterplatte_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      }
    ],
    "arcs": [
      {
        "id": "4b767e26-36d3-4880-b836-872f12620473",
        "filter": "$.*",
        "fromId": "5309778c-2f6a-44c0-aa17-bb3f15b7a606",
        "toId": "ebf2fff0-519c-468e-86d3-ef7959ab78ef"
      },
      {
        "id": "06ba3fef-52d0-4a6c-a080-a9f0bd1b18d2",
        "filter": "$",
        "fromId": "ebf2fff0-519c-468e-86d3-ef7959ab78ef",
        "toId": "b1987eda-8e08-4ced-b830-b6567f952ded"
      },
      {
        "id": "a0fbd897-67fd-4c2c-a47b-00a780d4c66f",
        "filter": "$.*",
        "fromId": "b1987eda-8e08-4ced-b830-b6567f952ded",
        "toId": "472fc7ef-856e-4c3f-811f-21e83e610f6e"
      },
      {
        "id": "6185c8a4-7a43-4748-9676-649f1a5a3623",
        "filter": "$",
        "fromId": "472fc7ef-856e-4c3f-811f-21e83e610f6e",
        "toId": "f08869f7-1c58-44f1-a0ee-51f8d948856c"
      },
      {
        "id": "cd8e42a1-e0e2-4eb3-aa85-005cb649541e",
        "filter": "$",
        "fromId": "6d92700a-bc7d-433b-b31b-2f4aeba310ae",
        "toId": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448"
      },
      {
        "id": "1cdbcae0-b5aa-4368-a24e-18c2918abf79",
        "filter": "$.*",
        "fromId": "f08869f7-1c58-44f1-a0ee-51f8d948856c",
        "toId": "6d92700a-bc7d-433b-b31b-2f4aeba310ae"
      },
      {
        "id": "4307dfbb-9b4b-49db-91d1-775c123fdc95",
        "filter": "$.*",
        "fromId": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448",
        "toId": "070c31ef-4141-4dd2-8e16-3e353cf2b119"
      },
      {
        "id": "8dcb59ae-b8fd-4267-8096-ce33205af894",
        "filter": "$",
        "fromId": "070c31ef-4141-4dd2-8e16-3e353cf2b119",
        "toId": "487ea0ae-a4de-43e7-bb49-5953c547398b"
      },
      {
        "id": "caea21c5-8a61-4bbc-9cf3-cbf1e5019dfb",
        "filter": "$.*",
        "fromId": "487ea0ae-a4de-43e7-bb49-5953c547398b",
        "toId": "80911f5a-d432-46cb-9268-0ea56a284add"
      },
      {
        "id": "23cc9f8e-acf1-4382-85cd-7190d45b2057",
        "filter": "$",
        "fromId": "80911f5a-d432-46cb-9268-0ea56a284add",
        "toId": "d312e07b-ebb7-4901-baa3-4685f2ebff45"
      },
      {
        "id": "70d8db2d-a0a4-4f6c-a0e4-34e931a11125",
        "filter": "$.*",
        "fromId": "d312e07b-ebb7-4901-baa3-4685f2ebff45",
        "toId": "986bafab-e88d-449f-9591-106351309bd6"
      },
      {
        "id": "cfbbbe59-1fa6-40db-80b8-1f9f534dcf02",
        "filter": "$",
        "fromId": "986bafab-e88d-449f-9591-106351309bd6",
        "toId": "d779b8e0-9388-4502-971c-bf3b4addc44e"
      },
      {
        "id": "e35a99fa-da1d-4e63-a0fc-076fc7a28751",
        "filter": "$.*",
        "fromId": "d779b8e0-9388-4502-971c-bf3b4addc44e",
        "toId": "4265e96e-df3e-46fd-b0b7-4637272f776b"
      },
      {
        "id": "63d06b4b-c0aa-46e5-bb52-7764b0ceb8f9",
        "filter": "$",
        "fromId": "4265e96e-df3e-46fd-b0b7-4637272f776b",
        "toId": "257dbecb-8cf9-4411-8f95-1c787c8333c4"
      },
      {
        "id": "ab78a55b-be38-42e4-8332-b4d139cd3a24",
        "filter": "$.*",
        "fromId": "257dbecb-8cf9-4411-8f95-1c787c8333c4",
        "toId": "958ce812-8c2e-44d7-b6fb-a52312bc8ce0"
      },
      {
        "id": "f1a66b36-f549-412c-949e-1ce50f65dbe6",
        "filter": "$",
        "fromId": "958ce812-8c2e-44d7-b6fb-a52312bc8ce0",
        "toId": "f5cf8f49-6389-4307-8c11-579e41685514"
      },
      {
        "id": "244ecbc2-ffd4-482b-862b-e7805a78f6b1",
        "filter": "$.*",
        "fromId": "f5cf8f49-6389-4307-8c11-579e41685514",
        "toId": "a46e1683-8427-4ec3-b4cd-04251579c484"
      },
      {
        "id": "5f331a3d-17aa-4d3d-a889-403939a9ba17",
        "filter": "$",
        "fromId": "a46e1683-8427-4ec3-b4cd-04251579c484",
        "toId": "6032860d-f236-4f7e-8be7-197934f4114b"
      },
      {
        "id": "bbdd5ea3-14b5-40ac-968e-d66d9fd19ebb",
        "filter": "$.*",
        "fromId": "6032860d-f236-4f7e-8be7-197934f4114b",
        "toId": "e370bc9a-0646-4ba5-9a70-01bb6b687e48"
      },
      {
        "id": "3b01d7f5-af16-4d4f-8a8b-ec03580e47a3",
        "filter": "$",
        "fromId": "e370bc9a-0646-4ba5-9a70-01bb6b687e48",
        "toId": "2575f3d8-5e2b-41d6-ad8f-0d085c266c07"
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
          "x": 264,
          "y": 276
        },
        "angle": 0,
        "id": "ebf2fff0-519c-468e-86d3-ef7959ab78ef",
        "jsonnetsType": "transition",
        "z": 1,
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
        "id": "472fc7ef-856e-4c3f-811f-21e83e610f6e",
        "jsonnetsType": "transition",
        "z": 2,
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
          "x": 1092,
          "y": 276
        },
        "angle": 0,
        "id": "6d92700a-bc7d-433b-b31b-2f4aeba310ae",
        "jsonnetsType": "transition",
        "z": 3,
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
          "y": 408
        },
        "angle": 0,
        "id": "070c31ef-4141-4dd2-8e16-3e353cf2b119",
        "jsonnetsType": "transition",
        "z": 4,
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
          "x": 1056,
          "y": 564
        },
        "angle": 0,
        "id": "80911f5a-d432-46cb-9268-0ea56a284add",
        "jsonnetsType": "transition",
        "z": 5,
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
          "x": 660,
          "y": 564
        },
        "angle": 0,
        "id": "986bafab-e88d-449f-9591-106351309bd6",
        "jsonnetsType": "transition",
        "z": 6,
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
        "id": "4265e96e-df3e-46fd-b0b7-4637272f776b",
        "jsonnetsType": "transition",
        "z": 7,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Nachbearbeitung"
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
          "y": 732
        },
        "angle": 0,
        "id": "958ce812-8c2e-44d7-b6fb-a52312bc8ce0",
        "jsonnetsType": "transition",
        "z": 8,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Test"
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
          "x": 251,
          "y": 911
        },
        "angle": 0,
        "id": "a46e1683-8427-4ec3-b4cd-04251579c484",
        "jsonnetsType": "transition",
        "z": 9,
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
        "id": "e370bc9a-0646-4ba5-9a70-01bb6b687e48",
        "jsonnetsType": "transition",
        "z": 10,
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
        "z": 22,
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
        "type": "standard.Link",
        "source": {
          "id": "5309778c-2f6a-44c0-aa17-bb3f15b7a606",
          "selector": ".root"
        },
        "target": {
          "id": "ebf2fff0-519c-468e-86d3-ef7959ab78ef",
          "selector": ".root"
        },
        "id": "4b767e26-36d3-4880-b836-872f12620473",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 53,
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
          "id": "ebf2fff0-519c-468e-86d3-ef7959ab78ef",
          "selector": ".root"
        },
        "target": {
          "id": "b1987eda-8e08-4ced-b830-b6567f952ded",
          "selector": ".root"
        },
        "id": "06ba3fef-52d0-4a6c-a080-a9f0bd1b18d2",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 54,
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
          "id": "b1987eda-8e08-4ced-b830-b6567f952ded",
          "selector": ".root"
        },
        "target": {
          "id": "472fc7ef-856e-4c3f-811f-21e83e610f6e",
          "selector": ".root"
        },
        "id": "a0fbd897-67fd-4c2c-a47b-00a780d4c66f",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 56,
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
          "id": "472fc7ef-856e-4c3f-811f-21e83e610f6e",
          "selector": ".root"
        },
        "target": {
          "id": "f08869f7-1c58-44f1-a0ee-51f8d948856c",
          "selector": ".root"
        },
        "id": "6185c8a4-7a43-4748-9676-649f1a5a3623",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 58,
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
          "id": "6d92700a-bc7d-433b-b31b-2f4aeba310ae",
          "selector": ".root"
        },
        "target": {
          "id": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448",
          "selector": ".root"
        },
        "id": "cd8e42a1-e0e2-4eb3-aa85-005cb649541e",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 62,
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
          "id": "f08869f7-1c58-44f1-a0ee-51f8d948856c",
          "selector": ".root"
        },
        "target": {
          "id": "6d92700a-bc7d-433b-b31b-2f4aeba310ae",
          "selector": ".root"
        },
        "id": "1cdbcae0-b5aa-4368-a24e-18c2918abf79",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 63,
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
          "id": "4d6e9dac-bf68-4b7b-86e2-fdbbb1261448",
          "selector": ".root"
        },
        "target": {
          "id": "070c31ef-4141-4dd2-8e16-3e353cf2b119",
          "selector": ".root"
        },
        "id": "4307dfbb-9b4b-49db-91d1-775c123fdc95",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 64,
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
          "id": "070c31ef-4141-4dd2-8e16-3e353cf2b119",
          "selector": ".root"
        },
        "target": {
          "id": "487ea0ae-a4de-43e7-bb49-5953c547398b",
          "selector": ".root"
        },
        "id": "8dcb59ae-b8fd-4267-8096-ce33205af894",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 65,
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
          "id": "487ea0ae-a4de-43e7-bb49-5953c547398b",
          "selector": ".root"
        },
        "target": {
          "id": "80911f5a-d432-46cb-9268-0ea56a284add",
          "selector": ".root"
        },
        "id": "caea21c5-8a61-4bbc-9cf3-cbf1e5019dfb",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 68,
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
          "id": "80911f5a-d432-46cb-9268-0ea56a284add",
          "selector": ".root"
        },
        "target": {
          "id": "d312e07b-ebb7-4901-baa3-4685f2ebff45",
          "selector": ".root"
        },
        "id": "23cc9f8e-acf1-4382-85cd-7190d45b2057",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 71,
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
          "id": "d312e07b-ebb7-4901-baa3-4685f2ebff45",
          "selector": ".root"
        },
        "target": {
          "id": "986bafab-e88d-449f-9591-106351309bd6",
          "selector": ".root"
        },
        "id": "70d8db2d-a0a4-4f6c-a0e4-34e931a11125",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 75,
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
          "id": "986bafab-e88d-449f-9591-106351309bd6",
          "selector": ".root"
        },
        "target": {
          "id": "d779b8e0-9388-4502-971c-bf3b4addc44e",
          "selector": ".root"
        },
        "id": "cfbbbe59-1fa6-40db-80b8-1f9f534dcf02",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 79,
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
          "id": "d779b8e0-9388-4502-971c-bf3b4addc44e",
          "selector": ".root"
        },
        "target": {
          "id": "4265e96e-df3e-46fd-b0b7-4637272f776b",
          "selector": ".root"
        },
        "id": "e35a99fa-da1d-4e63-a0fc-076fc7a28751",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 84,
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
          "id": "4265e96e-df3e-46fd-b0b7-4637272f776b",
          "selector": ".root"
        },
        "target": {
          "id": "257dbecb-8cf9-4411-8f95-1c787c8333c4",
          "selector": ".root"
        },
        "id": "63d06b4b-c0aa-46e5-bb52-7764b0ceb8f9",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 89,
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
          "id": "257dbecb-8cf9-4411-8f95-1c787c8333c4",
          "selector": ".root"
        },
        "target": {
          "id": "958ce812-8c2e-44d7-b6fb-a52312bc8ce0",
          "selector": ".root"
        },
        "id": "ab78a55b-be38-42e4-8332-b4d139cd3a24",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 90,
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
          "id": "958ce812-8c2e-44d7-b6fb-a52312bc8ce0",
          "selector": ".root"
        },
        "target": {
          "id": "f5cf8f49-6389-4307-8c11-579e41685514",
          "selector": ".root"
        },
        "id": "f1a66b36-f549-412c-949e-1ce50f65dbe6",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 92,
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
          "id": "f5cf8f49-6389-4307-8c11-579e41685514",
          "selector": ".root"
        },
        "target": {
          "id": "a46e1683-8427-4ec3-b4cd-04251579c484",
          "selector": ".root"
        },
        "id": "244ecbc2-ffd4-482b-862b-e7805a78f6b1",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 94,
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
          "id": "a46e1683-8427-4ec3-b4cd-04251579c484",
          "selector": ".root"
        },
        "target": {
          "id": "6032860d-f236-4f7e-8be7-197934f4114b",
          "selector": ".root"
        },
        "id": "5f331a3d-17aa-4d3d-a889-403939a9ba17",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 95,
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
          "id": "6032860d-f236-4f7e-8be7-197934f4114b",
          "selector": ".root"
        },
        "target": {
          "id": "e370bc9a-0646-4ba5-9a70-01bb6b687e48",
          "selector": ".root"
        },
        "id": "bbdd5ea3-14b5-40ac-968e-d66d9fd19ebb",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 96,
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
          "id": "e370bc9a-0646-4ba5-9a70-01bb6b687e48",
          "selector": ".root"
        },
        "target": {
          "id": "2575f3d8-5e2b-41d6-ad8f-0d085c266c07",
          "selector": ".root"
        },
        "id": "3b01d7f5-af16-4d4f-8a8b-ec03580e47a3",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 97,
        "vertices": [],
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