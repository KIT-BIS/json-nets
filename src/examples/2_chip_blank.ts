export const data = {
  "netData": {
    "places": [
      {
        "id": "1ccfb8d3-f7b8-415c-acbb-87313e9241b3",
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
          "$id": "1ccfb8d3-f7b8-415c-acbb-87313e9241b3"
        }
      },
      {
        "id": "626ede19-6726-45bf-b355-341f3b2d290e",
        "name": "p1",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "626ede19-6726-45bf-b355-341f3b2d290e"
        }
      },
      {
        "id": "c1f857bb-220a-4ea0-aa0e-82a8dae72243",
        "name": "p2",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "c1f857bb-220a-4ea0-aa0e-82a8dae72243"
        }
      },
      {
        "id": "6437bc37-738c-4d32-8c31-5d21821116aa",
        "name": "p3",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "6437bc37-738c-4d32-8c31-5d21821116aa"
        }
      },
      {
        "id": "84c18531-ecc9-4595-a717-71ab141e17af",
        "name": "p4",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "84c18531-ecc9-4595-a717-71ab141e17af"
        }
      },
      {
        "id": "4ce5f483-ed78-4c30-bd67-5f7f161541e7",
        "name": "p5",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "4ce5f483-ed78-4c30-bd67-5f7f161541e7"
        }
      },
      {
        "id": "54473421-8f35-47de-b64a-bc7ae45a2ea6",
        "name": "p6",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "54473421-8f35-47de-b64a-bc7ae45a2ea6"
        }
      },
      {
        "id": "58d13880-c38c-4a0f-8a41-642bf69009e0",
        "name": "p7",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "58d13880-c38c-4a0f-8a41-642bf69009e0"
        }
      },
      {
        "id": "74a6a016-cdc3-4a3f-833c-6561d5e8dc08",
        "name": "p8",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "74a6a016-cdc3-4a3f-833c-6561d5e8dc08"
        }
      },
      {
        "id": "a6d0ebbc-4df6-4c67-bae7-a5b3f38b1454",
        "name": "Chip",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "end",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "a6d0ebbc-4df6-4c67-bae7-a5b3f38b1454"
        }
      },
      {
        "id": "0256c4d8-833a-4318-9d4b-9f1c1cd46565",
        "name": "p9",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "0256c4d8-833a-4318-9d4b-9f1c1cd46565"
        }
      }
    ],
    "transitions": [
      {
        "id": "589f4456-a1c2-47b9-b8a9-7502d40447ad",
        "name": "Lithografie",
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
        "id": "00bf5b16-edf5-49aa-be39-5702f0657392",
        "name": "Dampfphasenabscheidung",
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
        "id": "c4b7aad3-0472-4528-8324-95557d8a5f23",
        "name": "Epitaxie",
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
        "id": "3388253a-bd47-4743-a84e-57e33bb2dd69",
        "name": "Dotieren",
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
        "id": "6649229c-dc74-49b3-81c4-16bcaf2df2de",
        "name": "Diffussion",
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
        "id": "7211dcc4-5212-4b32-b057-ea94869b20ee",
        "name": "Nassprozesse",
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
        "id": "9abe5df7-814c-4395-b25b-dd529fbf423f",
        "name": "Trockenätzen",
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
        "id": "09de952b-e9b9-484e-b277-ec53b1b18d8b",
        "name": "Beschichten",
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
        "id": "09a0982b-c37a-432b-9636-05548b0b683b",
        "name": "Polieren",
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
        "id": "123cd5e5-f7f2-462f-8a2c-4b7d9a926b04",
        "name": "Metrologie",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_chip_key": "local output_chip_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_chip_value": "local output_chip_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      }
    ],
    "arcs": [
      {
        "id": "1db9e399-2f4c-40df-8525-967520f257f5",
        "filter": "$.*",
        "fromId": "1ccfb8d3-f7b8-415c-acbb-87313e9241b3",
        "toId": "589f4456-a1c2-47b9-b8a9-7502d40447ad"
      },
      {
        "id": "1306fd03-766e-4c1e-accb-c2744e221301",
        "filter": "$",
        "fromId": "589f4456-a1c2-47b9-b8a9-7502d40447ad",
        "toId": "626ede19-6726-45bf-b355-341f3b2d290e"
      },
      {
        "id": "57c342a1-36ff-4b82-8fa7-fc7bc502434c",
        "filter": "$.*",
        "fromId": "626ede19-6726-45bf-b355-341f3b2d290e",
        "toId": "00bf5b16-edf5-49aa-be39-5702f0657392"
      },
      {
        "id": "54f08425-a3d5-4ab4-8b1d-bc51f5a43d73",
        "filter": "$",
        "fromId": "00bf5b16-edf5-49aa-be39-5702f0657392",
        "toId": "c1f857bb-220a-4ea0-aa0e-82a8dae72243"
      },
      {
        "id": "b0056d56-4888-40a2-8bd6-1c8cf904c29b",
        "filter": "$.*",
        "fromId": "c1f857bb-220a-4ea0-aa0e-82a8dae72243",
        "toId": "c4b7aad3-0472-4528-8324-95557d8a5f23"
      },
      {
        "id": "e1a943b2-fee8-4961-a41d-b95ba022528a",
        "filter": "$",
        "fromId": "c4b7aad3-0472-4528-8324-95557d8a5f23",
        "toId": "6437bc37-738c-4d32-8c31-5d21821116aa"
      },
      {
        "id": "bcc337af-901d-4735-b740-43b57acd8c95",
        "filter": "$.*",
        "fromId": "6437bc37-738c-4d32-8c31-5d21821116aa",
        "toId": "3388253a-bd47-4743-a84e-57e33bb2dd69"
      },
      {
        "id": "dd535a8f-7a85-4e11-9b38-adf4c307a796",
        "filter": "$",
        "fromId": "3388253a-bd47-4743-a84e-57e33bb2dd69",
        "toId": "84c18531-ecc9-4595-a717-71ab141e17af"
      },
      {
        "id": "5abc56e8-3e3e-49d1-b0b3-673eea0dd027",
        "filter": "$.*",
        "fromId": "84c18531-ecc9-4595-a717-71ab141e17af",
        "toId": "6649229c-dc74-49b3-81c4-16bcaf2df2de"
      },
      {
        "id": "692a6008-670c-4415-917f-c78b426f47f9",
        "filter": "$",
        "fromId": "6649229c-dc74-49b3-81c4-16bcaf2df2de",
        "toId": "4ce5f483-ed78-4c30-bd67-5f7f161541e7"
      },
      {
        "id": "ddc6e979-4c04-413a-b98f-99b61337c44d",
        "filter": "$.*",
        "fromId": "4ce5f483-ed78-4c30-bd67-5f7f161541e7",
        "toId": "7211dcc4-5212-4b32-b057-ea94869b20ee"
      },
      {
        "id": "d312cb51-db72-4c88-9e30-a9d0c60b5dfe",
        "filter": "$",
        "fromId": "7211dcc4-5212-4b32-b057-ea94869b20ee",
        "toId": "54473421-8f35-47de-b64a-bc7ae45a2ea6"
      },
      {
        "id": "8b54b8a8-f2bb-404d-953f-307d33f4af07",
        "filter": "$.*",
        "fromId": "54473421-8f35-47de-b64a-bc7ae45a2ea6",
        "toId": "9abe5df7-814c-4395-b25b-dd529fbf423f"
      },
      {
        "id": "493716c2-ac90-48b0-abd3-48abbdedf7b4",
        "filter": "$",
        "fromId": "9abe5df7-814c-4395-b25b-dd529fbf423f",
        "toId": "58d13880-c38c-4a0f-8a41-642bf69009e0"
      },
      {
        "id": "739a7280-ff27-440b-acd4-5e184f257175",
        "filter": "$.*",
        "fromId": "58d13880-c38c-4a0f-8a41-642bf69009e0",
        "toId": "09de952b-e9b9-484e-b277-ec53b1b18d8b"
      },
      {
        "id": "5e830217-0bbe-4cad-b36c-05405fc6282c",
        "filter": "$",
        "fromId": "09de952b-e9b9-484e-b277-ec53b1b18d8b",
        "toId": "74a6a016-cdc3-4a3f-833c-6561d5e8dc08"
      },
      {
        "id": "de186182-5c9b-4eb2-ac70-af87d3e90b32",
        "filter": "$.*",
        "fromId": "74a6a016-cdc3-4a3f-833c-6561d5e8dc08",
        "toId": "09a0982b-c37a-432b-9636-05548b0b683b"
      },
      {
        "id": "86640be4-3672-466a-9934-4c65d64f4087",
        "filter": "$",
        "fromId": "09a0982b-c37a-432b-9636-05548b0b683b",
        "toId": "0256c4d8-833a-4318-9d4b-9f1c1cd46565"
      },
      {
        "id": "65494ab6-bacb-419c-973a-23adb0b630c2",
        "filter": "$.*",
        "fromId": "0256c4d8-833a-4318-9d4b-9f1c1cd46565",
        "toId": "123cd5e5-f7f2-462f-8a2c-4b7d9a926b04"
      },
      {
        "id": "45fd2474-4e75-4548-83c4-6d14be8e3c97",
        "filter": "$",
        "fromId": "123cd5e5-f7f2-462f-8a2c-4b7d9a926b04",
        "toId": "a6d0ebbc-4df6-4c67-bae7-a5b3f38b1454"
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
          "x": 96,
          "y": 300
        },
        "angle": 0,
        "tokens": 1,
        "id": "1ccfb8d3-f7b8-415c-acbb-87313e9241b3",
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
          "x": 528,
          "y": 300
        },
        "angle": 0,
        "tokens": 0,
        "id": "626ede19-6726-45bf-b355-341f3b2d290e",
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
          "x": 947,
          "y": 299
        },
        "angle": 0,
        "tokens": 0,
        "id": "c1f857bb-220a-4ea0-aa0e-82a8dae72243",
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
          "x": 1332,
          "y": 300
        },
        "angle": 0,
        "tokens": 0,
        "id": "6437bc37-738c-4d32-8c31-5d21821116aa",
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
          "x": 1332,
          "y": 600
        },
        "angle": 0,
        "tokens": 0,
        "id": "84c18531-ecc9-4595-a717-71ab141e17af",
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
          "x": 948,
          "y": 600
        },
        "angle": 0,
        "tokens": 0,
        "id": "4ce5f483-ed78-4c30-bd67-5f7f161541e7",
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
          "x": 516,
          "y": 600
        },
        "angle": 0,
        "tokens": 0,
        "id": "54473421-8f35-47de-b64a-bc7ae45a2ea6",
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
          "x": 108,
          "y": 600
        },
        "angle": 0,
        "tokens": 0,
        "id": "58d13880-c38c-4a0f-8a41-642bf69009e0",
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
          "x": 108,
          "y": 876
        },
        "angle": 0,
        "tokens": 0,
        "id": "74a6a016-cdc3-4a3f-833c-6561d5e8dc08",
        "jsonnetsType": "place",
        "z": 19,
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
        "type": "pn.Place",
        "size": {
          "width": 50,
          "height": 50
        },
        "position": {
          "x": 960,
          "y": 876
        },
        "angle": 0,
        "tokens": 0,
        "id": "a6d0ebbc-4df6-4c67-bae7-a5b3f38b1454",
        "jsonnetsType": "place",
        "z": 20,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "Chip"
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
          "y": 876
        },
        "angle": 0,
        "tokens": 0,
        "id": "0256c4d8-833a-4318-9d4b-9f1c1cd46565",
        "jsonnetsType": "place",
        "z": 21,
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
        "type": "pn.Transition",
        "size": {
          "width": 100,
          "height": 50
        },
        "position": {
          "x": 288,
          "y": 300
        },
        "angle": 0,
        "id": "589f4456-a1c2-47b9-b8a9-7502d40447ad",
        "jsonnetsType": "transition",
        "z": 22,
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
          "x": 708,
          "y": 300
        },
        "angle": 0,
        "id": "00bf5b16-edf5-49aa-be39-5702f0657392",
        "jsonnetsType": "transition",
        "z": 23,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Dampfphasenabscheidung"
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
          "x": 1104,
          "y": 300
        },
        "angle": 0,
        "id": "c4b7aad3-0472-4528-8324-95557d8a5f23",
        "jsonnetsType": "transition",
        "z": 24,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Epitaxie"
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
          "x": 1308,
          "y": 444
        },
        "angle": 0,
        "id": "3388253a-bd47-4743-a84e-57e33bb2dd69",
        "jsonnetsType": "transition",
        "z": 25,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Dotieren"
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
          "x": 1104,
          "y": 600
        },
        "angle": 0,
        "id": "6649229c-dc74-49b3-81c4-16bcaf2df2de",
        "jsonnetsType": "transition",
        "z": 26,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Diffussion"
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
          "x": 708,
          "y": 600
        },
        "angle": 0,
        "id": "7211dcc4-5212-4b32-b057-ea94869b20ee",
        "jsonnetsType": "transition",
        "z": 27,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Nassprozesse"
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
          "y": 600
        },
        "angle": 0,
        "id": "9abe5df7-814c-4395-b25b-dd529fbf423f",
        "jsonnetsType": "transition",
        "z": 28,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Trockenätzen"
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
          "x": 84,
          "y": 744
        },
        "angle": 0,
        "id": "09de952b-e9b9-484e-b277-ec53b1b18d8b",
        "jsonnetsType": "transition",
        "z": 29,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Beschichten"
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
          "x": 276,
          "y": 876
        },
        "angle": 0,
        "id": "09a0982b-c37a-432b-9636-05548b0b683b",
        "jsonnetsType": "transition",
        "z": 30,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Polieren"
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
          "x": 720,
          "y": 876
        },
        "angle": 0,
        "id": "123cd5e5-f7f2-462f-8a2c-4b7d9a926b04",
        "jsonnetsType": "transition",
        "z": 31,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Metrologie"
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
          "id": "1ccfb8d3-f7b8-415c-acbb-87313e9241b3",
          "selector": ".root"
        },
        "target": {
          "id": "589f4456-a1c2-47b9-b8a9-7502d40447ad",
          "selector": ".root"
        },
        "id": "1db9e399-2f4c-40df-8525-967520f257f5",
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
          "id": "589f4456-a1c2-47b9-b8a9-7502d40447ad",
          "selector": ".root"
        },
        "target": {
          "id": "626ede19-6726-45bf-b355-341f3b2d290e",
          "selector": ".root"
        },
        "id": "1306fd03-766e-4c1e-accb-c2744e221301",
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
          "id": "626ede19-6726-45bf-b355-341f3b2d290e",
          "selector": ".root"
        },
        "target": {
          "id": "00bf5b16-edf5-49aa-be39-5702f0657392",
          "selector": ".root"
        },
        "id": "57c342a1-36ff-4b82-8fa7-fc7bc502434c",
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
          "id": "00bf5b16-edf5-49aa-be39-5702f0657392",
          "selector": ".root"
        },
        "target": {
          "id": "c1f857bb-220a-4ea0-aa0e-82a8dae72243",
          "selector": ".root"
        },
        "id": "54f08425-a3d5-4ab4-8b1d-bc51f5a43d73",
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
          "id": "c1f857bb-220a-4ea0-aa0e-82a8dae72243",
          "selector": ".root"
        },
        "target": {
          "id": "c4b7aad3-0472-4528-8324-95557d8a5f23",
          "selector": ".root"
        },
        "id": "b0056d56-4888-40a2-8bd6-1c8cf904c29b",
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
          "id": "c4b7aad3-0472-4528-8324-95557d8a5f23",
          "selector": ".root"
        },
        "target": {
          "id": "6437bc37-738c-4d32-8c31-5d21821116aa",
          "selector": ".root"
        },
        "id": "e1a943b2-fee8-4961-a41d-b95ba022528a",
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
          "id": "6437bc37-738c-4d32-8c31-5d21821116aa",
          "selector": ".root"
        },
        "target": {
          "id": "3388253a-bd47-4743-a84e-57e33bb2dd69",
          "selector": ".root"
        },
        "id": "bcc337af-901d-4735-b740-43b57acd8c95",
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
          "id": "3388253a-bd47-4743-a84e-57e33bb2dd69",
          "selector": ".root"
        },
        "target": {
          "id": "84c18531-ecc9-4595-a717-71ab141e17af",
          "selector": ".root"
        },
        "id": "dd535a8f-7a85-4e11-9b38-adf4c307a796",
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
          "id": "84c18531-ecc9-4595-a717-71ab141e17af",
          "selector": ".root"
        },
        "target": {
          "id": "6649229c-dc74-49b3-81c4-16bcaf2df2de",
          "selector": ".root"
        },
        "id": "5abc56e8-3e3e-49d1-b0b3-673eea0dd027",
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
          "id": "6649229c-dc74-49b3-81c4-16bcaf2df2de",
          "selector": ".root"
        },
        "target": {
          "id": "4ce5f483-ed78-4c30-bd67-5f7f161541e7",
          "selector": ".root"
        },
        "id": "692a6008-670c-4415-917f-c78b426f47f9",
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
          "id": "4ce5f483-ed78-4c30-bd67-5f7f161541e7",
          "selector": ".root"
        },
        "target": {
          "id": "7211dcc4-5212-4b32-b057-ea94869b20ee",
          "selector": ".root"
        },
        "id": "ddc6e979-4c04-413a-b98f-99b61337c44d",
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
          "id": "7211dcc4-5212-4b32-b057-ea94869b20ee",
          "selector": ".root"
        },
        "target": {
          "id": "54473421-8f35-47de-b64a-bc7ae45a2ea6",
          "selector": ".root"
        },
        "id": "d312cb51-db72-4c88-9e30-a9d0c60b5dfe",
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
          "id": "54473421-8f35-47de-b64a-bc7ae45a2ea6",
          "selector": ".root"
        },
        "target": {
          "id": "9abe5df7-814c-4395-b25b-dd529fbf423f",
          "selector": ".root"
        },
        "id": "8b54b8a8-f2bb-404d-953f-307d33f4af07",
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
          "id": "9abe5df7-814c-4395-b25b-dd529fbf423f",
          "selector": ".root"
        },
        "target": {
          "id": "58d13880-c38c-4a0f-8a41-642bf69009e0",
          "selector": ".root"
        },
        "id": "493716c2-ac90-48b0-abd3-48abbdedf7b4",
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
          "id": "58d13880-c38c-4a0f-8a41-642bf69009e0",
          "selector": ".root"
        },
        "target": {
          "id": "09de952b-e9b9-484e-b277-ec53b1b18d8b",
          "selector": ".root"
        },
        "id": "739a7280-ff27-440b-acd4-5e184f257175",
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
          "id": "09de952b-e9b9-484e-b277-ec53b1b18d8b",
          "selector": ".root"
        },
        "target": {
          "id": "74a6a016-cdc3-4a3f-833c-6561d5e8dc08",
          "selector": ".root"
        },
        "id": "5e830217-0bbe-4cad-b36c-05405fc6282c",
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
          "id": "74a6a016-cdc3-4a3f-833c-6561d5e8dc08",
          "selector": ".root"
        },
        "target": {
          "id": "09a0982b-c37a-432b-9636-05548b0b683b",
          "selector": ".root"
        },
        "id": "de186182-5c9b-4eb2-ac70-af87d3e90b32",
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
          "id": "09a0982b-c37a-432b-9636-05548b0b683b",
          "selector": ".root"
        },
        "target": {
          "id": "0256c4d8-833a-4318-9d4b-9f1c1cd46565",
          "selector": ".root"
        },
        "id": "86640be4-3672-466a-9934-4c65d64f4087",
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
          "id": "0256c4d8-833a-4318-9d4b-9f1c1cd46565",
          "selector": ".root"
        },
        "target": {
          "id": "123cd5e5-f7f2-462f-8a2c-4b7d9a926b04",
          "selector": ".root"
        },
        "id": "65494ab6-bacb-419c-973a-23adb0b630c2",
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
          "id": "123cd5e5-f7f2-462f-8a2c-4b7d9a926b04",
          "selector": ".root"
        },
        "target": {
          "id": "a6d0ebbc-4df6-4c67-bae7-a5b3f38b1454",
          "selector": ".root"
        },
        "id": "45fd2474-4e75-4548-83c4-6d14be8e3c97",
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