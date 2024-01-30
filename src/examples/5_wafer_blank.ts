export const data = {
  "netData": {
    "places": [
      {
        "id": "5826fe10-c01b-486e-b213-9e33f30cf8c2",
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
          "$id": "5826fe10-c01b-486e-b213-9e33f30cf8c2"
        }
      },
      {
        "id": "6b2916e9-3c05-4b3c-8f4d-469b81cb05a9",
        "name": "p1",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "6b2916e9-3c05-4b3c-8f4d-469b81cb05a9"
        }
      },
      {
        "id": "d52d8bfb-4e9e-4e45-8487-6794fb4c9c60",
        "name": "p2",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "d52d8bfb-4e9e-4e45-8487-6794fb4c9c60"
        }
      },
      {
        "id": "f5c8291f-8cb8-4f85-825a-33e170c20c11",
        "name": "p3",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "f5c8291f-8cb8-4f85-825a-33e170c20c11"
        }
      },
      {
        "id": "f1205391-5230-47f3-b7ac-6615d1830898",
        "name": "p4",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "f1205391-5230-47f3-b7ac-6615d1830898"
        }
      },
      {
        "id": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c",
        "name": "p5",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c"
        }
      },
      {
        "id": "825401fa-60cd-497d-927e-ccd110cbd236",
        "name": "p6",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "825401fa-60cd-497d-927e-ccd110cbd236"
        }
      },
      {
        "id": "8be9e972-2eba-4766-8af4-1d5e18f2f0d3",
        "name": "Wafer",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "end",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "8be9e972-2eba-4766-8af4-1d5e18f2f0d3"
        }
      }
    ],
    "transitions": [
      {
        "id": "3d033de6-8a88-4bf5-a254-4b0e12bb4a73",
        "name": "Siliziumpulver einschmelzen",
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
        "id": "b94b23ce-0772-41e4-9f71-95ccc3a07dd2",
        "name": "Polysilizium einschmelzen",
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
        "id": "341e9610-917b-4fb7-abf7-2cd28a8e797d",
        "name": "Czochralski-Verfahren",
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
        "id": "4aaf3cfa-1c62-48b5-b03b-263786a9dd01",
        "name": "Reinigung",
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
        "id": "756380c9-ee4d-432f-87bf-e77e965eddb1",
        "name": "Sägen",
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
        "id": "911288eb-743d-49bd-a5dd-b1eff219b008",
        "name": "Schleifen",
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
        "id": "08cb0854-cec0-4744-9ece-31dbe910143e",
        "name": "Oberflächenbehandlung",
        "preface": "\nlocal thgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\nlocal calculateFootprint(component) = \n  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100\n  else component.amount * component.ghgFactor * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_wafer_key": "local output_wafer_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_wafer_value": "local output_wafer_value = { scope: 'control', ghgFactor: totalFootprint, amount: 1, \n    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      }
    ],
    "arcs": [
      {
        "id": "a077c72b-9a25-40be-8980-3257f190a018",
        "filter": "$.*",
        "fromId": "5826fe10-c01b-486e-b213-9e33f30cf8c2",
        "toId": "3d033de6-8a88-4bf5-a254-4b0e12bb4a73"
      },
      {
        "id": "28b9338c-a0e6-46d5-8fc7-5b0320a6e9ca",
        "filter": "$",
        "fromId": "3d033de6-8a88-4bf5-a254-4b0e12bb4a73",
        "toId": "6b2916e9-3c05-4b3c-8f4d-469b81cb05a9"
      },
      {
        "id": "f101ef50-961f-44b6-b1bb-eb1b32ed3dca",
        "filter": "$.*",
        "fromId": "6b2916e9-3c05-4b3c-8f4d-469b81cb05a9",
        "toId": "4aaf3cfa-1c62-48b5-b03b-263786a9dd01"
      },
      {
        "id": "27573b52-695b-48cc-9da0-87d465dd231f",
        "filter": "$",
        "fromId": "4aaf3cfa-1c62-48b5-b03b-263786a9dd01",
        "toId": "d52d8bfb-4e9e-4e45-8487-6794fb4c9c60"
      },
      {
        "id": "cbf5d015-da11-4b78-9a1d-3020aa32b1af",
        "filter": "$.*",
        "fromId": "d52d8bfb-4e9e-4e45-8487-6794fb4c9c60",
        "toId": "b94b23ce-0772-41e4-9f71-95ccc3a07dd2"
      },
      {
        "id": "28cdbd42-b723-47d9-9c7e-4cb5173ae4fe",
        "filter": "$",
        "fromId": "b94b23ce-0772-41e4-9f71-95ccc3a07dd2",
        "toId": "f5c8291f-8cb8-4f85-825a-33e170c20c11"
      },
      {
        "id": "9417d8b1-e864-4b4b-aaa7-6a9c3ea1a3ef",
        "filter": "$.*",
        "fromId": "f5c8291f-8cb8-4f85-825a-33e170c20c11",
        "toId": "341e9610-917b-4fb7-abf7-2cd28a8e797d"
      },
      {
        "id": "959fe57e-eb93-4b0a-bd67-ec58fb380b57",
        "filter": "$",
        "fromId": "341e9610-917b-4fb7-abf7-2cd28a8e797d",
        "toId": "f1205391-5230-47f3-b7ac-6615d1830898"
      },
      {
        "id": "3e083543-bfa1-4b15-afdc-9945184b4743",
        "filter": "$.*",
        "fromId": "f1205391-5230-47f3-b7ac-6615d1830898",
        "toId": "756380c9-ee4d-432f-87bf-e77e965eddb1"
      },
      {
        "id": "334c8a3e-2179-4b68-ba99-fb1e7101df54",
        "filter": "$",
        "fromId": "756380c9-ee4d-432f-87bf-e77e965eddb1",
        "toId": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c"
      },
      {
        "id": "3aa3e732-fb62-4b5a-91c7-6a7f8c5ce582",
        "filter": "$.*",
        "fromId": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c",
        "toId": "911288eb-743d-49bd-a5dd-b1eff219b008"
      },
      {
        "id": "6c3ad4c1-3ac9-4bc0-9f2b-829a33d816d3",
        "filter": "$",
        "fromId": "911288eb-743d-49bd-a5dd-b1eff219b008",
        "toId": "825401fa-60cd-497d-927e-ccd110cbd236"
      },
      {
        "id": "ff34c666-c412-44b1-b039-3b3bdffdb28e",
        "filter": "$.*",
        "fromId": "825401fa-60cd-497d-927e-ccd110cbd236",
        "toId": "08cb0854-cec0-4744-9ece-31dbe910143e"
      },
      {
        "id": "c5aa744d-b34e-43b0-8304-998944b25103",
        "filter": "$",
        "fromId": "08cb0854-cec0-4744-9ece-31dbe910143e",
        "toId": "8be9e972-2eba-4766-8af4-1d5e18f2f0d3"
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
          "x": 300,
          "y": 264
        },
        "angle": 0,
        "id": "3d033de6-8a88-4bf5-a254-4b0e12bb4a73",
        "jsonnetsType": "transition",
        "z": 1,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Siliziumpulver einschmelzen"
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
          "x": 1032,
          "y": 264
        },
        "angle": 0,
        "id": "b94b23ce-0772-41e4-9f71-95ccc3a07dd2",
        "jsonnetsType": "transition",
        "z": 2,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Polysilizium einschmelzen"
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
          "x": 1272,
          "y": 396
        },
        "angle": 0,
        "id": "341e9610-917b-4fb7-abf7-2cd28a8e797d",
        "jsonnetsType": "transition",
        "z": 3,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Czochralski-Verfahren"
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
          "x": 636,
          "y": 264
        },
        "angle": 0,
        "id": "4aaf3cfa-1c62-48b5-b03b-263786a9dd01",
        "jsonnetsType": "transition",
        "z": 4,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Reinigung"
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
          "x": 1032,
          "y": 516
        },
        "angle": 0,
        "id": "756380c9-ee4d-432f-87bf-e77e965eddb1",
        "jsonnetsType": "transition",
        "z": 5,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Sägen"
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
          "x": 636,
          "y": 516
        },
        "angle": 0,
        "id": "911288eb-743d-49bd-a5dd-b1eff219b008",
        "jsonnetsType": "transition",
        "z": 6,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Schleifen"
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
          "x": 288,
          "y": 516
        },
        "angle": 0,
        "id": "08cb0854-cec0-4744-9ece-31dbe910143e",
        "jsonnetsType": "transition",
        "z": 7,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Oberflächenbehandlung"
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
          "x": 132,
          "y": 264
        },
        "angle": 0,
        "tokens": 1,
        "id": "5826fe10-c01b-486e-b213-9e33f30cf8c2",
        "jsonnetsType": "place",
        "z": 8,
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
          "x": 504,
          "y": 264
        },
        "angle": 0,
        "tokens": 0,
        "id": "6b2916e9-3c05-4b3c-8f4d-469b81cb05a9",
        "jsonnetsType": "place",
        "z": 9,
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
          "x": 840,
          "y": 264
        },
        "angle": 0,
        "tokens": 0,
        "id": "d52d8bfb-4e9e-4e45-8487-6794fb4c9c60",
        "jsonnetsType": "place",
        "z": 10,
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
          "x": 1296,
          "y": 264
        },
        "angle": 0,
        "tokens": 0,
        "id": "f5c8291f-8cb8-4f85-825a-33e170c20c11",
        "jsonnetsType": "place",
        "z": 11,
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
          "x": 1296,
          "y": 516
        },
        "angle": 0,
        "tokens": 0,
        "id": "f1205391-5230-47f3-b7ac-6615d1830898",
        "jsonnetsType": "place",
        "z": 12,
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
          "x": 840,
          "y": 516
        },
        "angle": 0,
        "tokens": 0,
        "id": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c",
        "jsonnetsType": "place",
        "z": 13,
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
          "x": 504,
          "y": 516
        },
        "angle": 0,
        "tokens": 0,
        "id": "825401fa-60cd-497d-927e-ccd110cbd236",
        "jsonnetsType": "place",
        "z": 14,
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
          "x": 132,
          "y": 516
        },
        "angle": 0,
        "tokens": 0,
        "id": "8be9e972-2eba-4766-8af4-1d5e18f2f0d3",
        "jsonnetsType": "place",
        "z": 15,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "Wafer"
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
          "id": "5826fe10-c01b-486e-b213-9e33f30cf8c2",
          "selector": ".root"
        },
        "target": {
          "id": "3d033de6-8a88-4bf5-a254-4b0e12bb4a73",
          "selector": ".root"
        },
        "id": "a077c72b-9a25-40be-8980-3257f190a018",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 33,
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
          "id": "3d033de6-8a88-4bf5-a254-4b0e12bb4a73",
          "selector": ".root"
        },
        "target": {
          "id": "6b2916e9-3c05-4b3c-8f4d-469b81cb05a9",
          "selector": ".root"
        },
        "id": "28b9338c-a0e6-46d5-8fc7-5b0320a6e9ca",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 36,
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
          "id": "6b2916e9-3c05-4b3c-8f4d-469b81cb05a9",
          "selector": ".root"
        },
        "target": {
          "id": "4aaf3cfa-1c62-48b5-b03b-263786a9dd01",
          "selector": ".root"
        },
        "id": "f101ef50-961f-44b6-b1bb-eb1b32ed3dca",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 37,
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
          "id": "4aaf3cfa-1c62-48b5-b03b-263786a9dd01",
          "selector": ".root"
        },
        "target": {
          "id": "d52d8bfb-4e9e-4e45-8487-6794fb4c9c60",
          "selector": ".root"
        },
        "id": "27573b52-695b-48cc-9da0-87d465dd231f",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 38,
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
          "id": "d52d8bfb-4e9e-4e45-8487-6794fb4c9c60",
          "selector": ".root"
        },
        "target": {
          "id": "b94b23ce-0772-41e4-9f71-95ccc3a07dd2",
          "selector": ".root"
        },
        "id": "cbf5d015-da11-4b78-9a1d-3020aa32b1af",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 39,
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
          "id": "b94b23ce-0772-41e4-9f71-95ccc3a07dd2",
          "selector": ".root"
        },
        "target": {
          "id": "f5c8291f-8cb8-4f85-825a-33e170c20c11",
          "selector": ".root"
        },
        "id": "28cdbd42-b723-47d9-9c7e-4cb5173ae4fe",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 40,
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
          "id": "f5c8291f-8cb8-4f85-825a-33e170c20c11",
          "selector": ".root"
        },
        "target": {
          "id": "341e9610-917b-4fb7-abf7-2cd28a8e797d",
          "selector": ".root"
        },
        "id": "9417d8b1-e864-4b4b-aaa7-6a9c3ea1a3ef",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 41,
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
          "id": "341e9610-917b-4fb7-abf7-2cd28a8e797d",
          "selector": ".root"
        },
        "target": {
          "id": "f1205391-5230-47f3-b7ac-6615d1830898",
          "selector": ".root"
        },
        "id": "959fe57e-eb93-4b0a-bd67-ec58fb380b57",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 42,
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
          "id": "f1205391-5230-47f3-b7ac-6615d1830898",
          "selector": ".root"
        },
        "target": {
          "id": "756380c9-ee4d-432f-87bf-e77e965eddb1",
          "selector": ".root"
        },
        "id": "3e083543-bfa1-4b15-afdc-9945184b4743",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 43,
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
          "id": "756380c9-ee4d-432f-87bf-e77e965eddb1",
          "selector": ".root"
        },
        "target": {
          "id": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c",
          "selector": ".root"
        },
        "id": "334c8a3e-2179-4b68-ba99-fb1e7101df54",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 44,
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
          "id": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c",
          "selector": ".root"
        },
        "target": {
          "id": "911288eb-743d-49bd-a5dd-b1eff219b008",
          "selector": ".root"
        },
        "id": "3aa3e732-fb62-4b5a-91c7-6a7f8c5ce582",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 45,
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
          "id": "911288eb-743d-49bd-a5dd-b1eff219b008",
          "selector": ".root"
        },
        "target": {
          "id": "825401fa-60cd-497d-927e-ccd110cbd236",
          "selector": ".root"
        },
        "id": "6c3ad4c1-3ac9-4bc0-9f2b-829a33d816d3",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 46,
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
          "id": "825401fa-60cd-497d-927e-ccd110cbd236",
          "selector": ".root"
        },
        "target": {
          "id": "08cb0854-cec0-4744-9ece-31dbe910143e",
          "selector": ".root"
        },
        "id": "ff34c666-c412-44b1-b039-3b3bdffdb28e",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 47,
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
          "id": "08cb0854-cec0-4744-9ece-31dbe910143e",
          "selector": ".root"
        },
        "target": {
          "id": "8be9e972-2eba-4766-8af4-1d5e18f2f0d3",
          "selector": ".root"
        },
        "id": "c5aa744d-b34e-43b0-8304-998944b25103",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 48,
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