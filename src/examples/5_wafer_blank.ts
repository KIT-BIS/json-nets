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
        "id": "83447b3c-d063-4eb3-82df-d6ac7e5838f9",
        "name": "Siliziumpulver einschmelzen",
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
        "id": "be938c8c-eb3f-4019-9248-d06df11f6668",
        "name": "Reinigen",
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
        "id": "7da089da-d214-432c-a8fd-6ab38081843b",
        "name": "Polysilizium einschmelzen",
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
        "id": "425ec761-277c-4bc6-8b63-60e651b1223e",
        "name": "Czochralski-Verfahren",
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
        "id": "3d887d06-6b5e-4733-b487-fb28393f995a",
        "name": "Sägen",
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
        "id": "9df90d66-8f44-4709-aa9e-015d92d6f907",
        "name": "Schleifen",
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
        "id": "e364df88-9898-4317-9dd4-71eced03218c",
        "name": "Oberflächenbehandlung",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_wafer_key": "local output_wafer_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_wafer_value": "local output_wafer_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      }
    ],
    "arcs": [
      {
        "id": "9952bbb5-ee12-47f5-9f8c-6ecc65e9978e",
        "filter": "$.*",
        "fromId": "5826fe10-c01b-486e-b213-9e33f30cf8c2",
        "toId": "83447b3c-d063-4eb3-82df-d6ac7e5838f9"
      },
      {
        "id": "98564d96-90e1-4bd7-88d1-7ea2fd0e3e6a",
        "filter": "$",
        "fromId": "83447b3c-d063-4eb3-82df-d6ac7e5838f9",
        "toId": "6b2916e9-3c05-4b3c-8f4d-469b81cb05a9"
      },
      {
        "id": "fd2ec139-fb41-47fe-801b-3bb11b1e8e25",
        "filter": "$.*",
        "fromId": "6b2916e9-3c05-4b3c-8f4d-469b81cb05a9",
        "toId": "be938c8c-eb3f-4019-9248-d06df11f6668"
      },
      {
        "id": "ae5dc3e8-7f0d-4f8a-84bd-4881cdfef516",
        "filter": "$",
        "fromId": "be938c8c-eb3f-4019-9248-d06df11f6668",
        "toId": "d52d8bfb-4e9e-4e45-8487-6794fb4c9c60"
      },
      {
        "id": "1dd9e330-42b4-4cfc-a172-e17023e63f43",
        "filter": "$.*",
        "fromId": "d52d8bfb-4e9e-4e45-8487-6794fb4c9c60",
        "toId": "7da089da-d214-432c-a8fd-6ab38081843b"
      },
      {
        "id": "da9e1ee2-3c85-4829-890c-ebdc01a38a4e",
        "filter": "$",
        "fromId": "7da089da-d214-432c-a8fd-6ab38081843b",
        "toId": "f5c8291f-8cb8-4f85-825a-33e170c20c11"
      },
      {
        "id": "bb71cb17-306f-4249-8af8-b6fbd3f72196",
        "filter": "$.*",
        "fromId": "f5c8291f-8cb8-4f85-825a-33e170c20c11",
        "toId": "425ec761-277c-4bc6-8b63-60e651b1223e"
      },
      {
        "id": "3b591ef6-51bf-4910-add7-4a58d16cc052",
        "filter": "$",
        "fromId": "425ec761-277c-4bc6-8b63-60e651b1223e",
        "toId": "f1205391-5230-47f3-b7ac-6615d1830898"
      },
      {
        "id": "d9e4a496-a108-4cd5-a4e3-5613f1cac1fb",
        "filter": "$.*",
        "fromId": "f1205391-5230-47f3-b7ac-6615d1830898",
        "toId": "3d887d06-6b5e-4733-b487-fb28393f995a"
      },
      {
        "id": "19df2ab5-08d5-4766-915d-88fd58c604ad",
        "filter": "$",
        "fromId": "3d887d06-6b5e-4733-b487-fb28393f995a",
        "toId": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c"
      },
      {
        "id": "6830cef6-fba6-47ab-9e98-831a79189874",
        "filter": "$.*",
        "fromId": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c",
        "toId": "9df90d66-8f44-4709-aa9e-015d92d6f907"
      },
      {
        "id": "01d4e222-45b7-4b90-91fd-24fb2b4b3703",
        "filter": "$",
        "fromId": "9df90d66-8f44-4709-aa9e-015d92d6f907",
        "toId": "825401fa-60cd-497d-927e-ccd110cbd236"
      },
      {
        "id": "0aa216cb-2780-478a-bfe7-0b5767c073a6",
        "filter": "$.*",
        "fromId": "825401fa-60cd-497d-927e-ccd110cbd236",
        "toId": "e364df88-9898-4317-9dd4-71eced03218c"
      },
      {
        "id": "3414b4ea-d6c5-431f-ad59-3f6a4cdc8c04",
        "filter": "$",
        "fromId": "e364df88-9898-4317-9dd4-71eced03218c",
        "toId": "8be9e972-2eba-4766-8af4-1d5e18f2f0d3"
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
        "id": "83447b3c-d063-4eb3-82df-d6ac7e5838f9",
        "jsonnetsType": "transition",
        "z": 16,
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
          "x": 648,
          "y": 264
        },
        "angle": 0,
        "id": "be938c8c-eb3f-4019-9248-d06df11f6668",
        "jsonnetsType": "transition",
        "z": 17,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Reinigen"
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
        "id": "7da089da-d214-432c-a8fd-6ab38081843b",
        "jsonnetsType": "transition",
        "z": 18,
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
        "id": "425ec761-277c-4bc6-8b63-60e651b1223e",
        "jsonnetsType": "transition",
        "z": 19,
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
          "x": 1032,
          "y": 516
        },
        "angle": 0,
        "id": "3d887d06-6b5e-4733-b487-fb28393f995a",
        "jsonnetsType": "transition",
        "z": 20,
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
          "x": 648,
          "y": 516
        },
        "angle": 0,
        "id": "9df90d66-8f44-4709-aa9e-015d92d6f907",
        "jsonnetsType": "transition",
        "z": 21,
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
          "x": 300,
          "y": 516
        },
        "angle": 0,
        "id": "e364df88-9898-4317-9dd4-71eced03218c",
        "jsonnetsType": "transition",
        "z": 22,
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
        "type": "standard.Link",
        "source": {
          "id": "5826fe10-c01b-486e-b213-9e33f30cf8c2",
          "selector": ".root"
        },
        "target": {
          "id": "83447b3c-d063-4eb3-82df-d6ac7e5838f9",
          "selector": ".root"
        },
        "id": "9952bbb5-ee12-47f5-9f8c-6ecc65e9978e",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 23,
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
          "id": "83447b3c-d063-4eb3-82df-d6ac7e5838f9",
          "selector": ".root"
        },
        "target": {
          "id": "6b2916e9-3c05-4b3c-8f4d-469b81cb05a9",
          "selector": ".root"
        },
        "id": "98564d96-90e1-4bd7-88d1-7ea2fd0e3e6a",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 24,
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
          "id": "be938c8c-eb3f-4019-9248-d06df11f6668",
          "selector": ".root"
        },
        "id": "fd2ec139-fb41-47fe-801b-3bb11b1e8e25",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 25,
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
          "id": "be938c8c-eb3f-4019-9248-d06df11f6668",
          "selector": ".root"
        },
        "target": {
          "id": "d52d8bfb-4e9e-4e45-8487-6794fb4c9c60",
          "selector": ".root"
        },
        "id": "ae5dc3e8-7f0d-4f8a-84bd-4881cdfef516",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 26,
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
          "id": "7da089da-d214-432c-a8fd-6ab38081843b",
          "selector": ".root"
        },
        "id": "1dd9e330-42b4-4cfc-a172-e17023e63f43",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 27,
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
          "id": "7da089da-d214-432c-a8fd-6ab38081843b",
          "selector": ".root"
        },
        "target": {
          "id": "f5c8291f-8cb8-4f85-825a-33e170c20c11",
          "selector": ".root"
        },
        "id": "da9e1ee2-3c85-4829-890c-ebdc01a38a4e",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 28,
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
          "id": "425ec761-277c-4bc6-8b63-60e651b1223e",
          "selector": ".root"
        },
        "id": "bb71cb17-306f-4249-8af8-b6fbd3f72196",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 29,
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
          "id": "425ec761-277c-4bc6-8b63-60e651b1223e",
          "selector": ".root"
        },
        "target": {
          "id": "f1205391-5230-47f3-b7ac-6615d1830898",
          "selector": ".root"
        },
        "id": "3b591ef6-51bf-4910-add7-4a58d16cc052",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 30,
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
          "id": "3d887d06-6b5e-4733-b487-fb28393f995a",
          "selector": ".root"
        },
        "id": "d9e4a496-a108-4cd5-a4e3-5613f1cac1fb",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 31,
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
          "id": "3d887d06-6b5e-4733-b487-fb28393f995a",
          "selector": ".root"
        },
        "target": {
          "id": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c",
          "selector": ".root"
        },
        "id": "19df2ab5-08d5-4766-915d-88fd58c604ad",
        "jsonnetsType": "postset",
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
          "id": "8d30c6c3-65d0-4485-a8cd-714ee0ba569c",
          "selector": ".root"
        },
        "target": {
          "id": "9df90d66-8f44-4709-aa9e-015d92d6f907",
          "selector": ".root"
        },
        "id": "6830cef6-fba6-47ab-9e98-831a79189874",
        "jsonnetsType": "preset",
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
          "id": "9df90d66-8f44-4709-aa9e-015d92d6f907",
          "selector": ".root"
        },
        "target": {
          "id": "825401fa-60cd-497d-927e-ccd110cbd236",
          "selector": ".root"
        },
        "id": "01d4e222-45b7-4b90-91fd-24fb2b4b3703",
        "jsonnetsType": "postset",
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
          "id": "825401fa-60cd-497d-927e-ccd110cbd236",
          "selector": ".root"
        },
        "target": {
          "id": "e364df88-9898-4317-9dd4-71eced03218c",
          "selector": ".root"
        },
        "id": "0aa216cb-2780-478a-bfe7-0b5767c073a6",
        "jsonnetsType": "preset",
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
          "id": "e364df88-9898-4317-9dd4-71eced03218c",
          "selector": ".root"
        },
        "target": {
          "id": "8be9e972-2eba-4766-8af4-1d5e18f2f0d3",
          "selector": ".root"
        },
        "id": "3414b4ea-d6c5-431f-ad59-3f6a4cdc8c04",
        "jsonnetsType": "postset",
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
      }
    ]
  }
}