export const data = {
  "netData": {
    "places": [
      {
        "id": "c49b0296-19cf-4857-90c0-3f93b638b877",
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
          "$id": "c49b0296-19cf-4857-90c0-3f93b638b877"
        }
      },
      {
        "id": "f1f4dfea-5277-4c6a-88f2-b76d3a12ce5d",
        "name": "p1",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "f1f4dfea-5277-4c6a-88f2-b76d3a12ce5d"
        }
      },
      {
        "id": "cd4b6f24-d1b8-458d-815a-5dece4b147ac",
        "name": "Kamera",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "end",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "cd4b6f24-d1b8-458d-815a-5dece4b147ac"
        }
      },
      {
        "id": "bd54b190-4747-4b82-a2b0-0b4851681059",
        "name": "p2",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "bd54b190-4747-4b82-a2b0-0b4851681059"
        }
      }
    ],
    "transitions": [
      {
        "id": "9ab06d0d-29d3-4580-bf44-8e36194e65f1",
        "name": "Montage",
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
        "id": "7f9900f0-7d76-4067-b22e-391bdd91a101",
        "name": "Reinigung",
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
        "id": "a8940d72-5eff-49ae-98f3-ac64e086ff8d",
        "name": "Prüfung",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_kamera_key": "local output_kamera_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_kamera_value": "local output_kamera_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      }
    ],
    "arcs": [
      {
        "id": "2fec368f-9bd4-41f2-bfb6-fd0901c9d325",
        "filter": "$.*",
        "fromId": "c49b0296-19cf-4857-90c0-3f93b638b877",
        "toId": "9ab06d0d-29d3-4580-bf44-8e36194e65f1"
      },
      {
        "id": "03a523fd-aa6c-4f9e-aebc-b30acdb1dc04",
        "filter": "$",
        "fromId": "9ab06d0d-29d3-4580-bf44-8e36194e65f1",
        "toId": "f1f4dfea-5277-4c6a-88f2-b76d3a12ce5d"
      },
      {
        "id": "6b836a80-ac07-4b53-b0ee-7367cb417425",
        "filter": "$.*",
        "fromId": "f1f4dfea-5277-4c6a-88f2-b76d3a12ce5d",
        "toId": "7f9900f0-7d76-4067-b22e-391bdd91a101"
      },
      {
        "id": "3e4a241e-f6b4-49fd-963a-485682dee440",
        "filter": "$",
        "fromId": "7f9900f0-7d76-4067-b22e-391bdd91a101",
        "toId": "bd54b190-4747-4b82-a2b0-0b4851681059"
      },
      {
        "id": "aee2a50a-3045-49ff-9a60-2a4bede9ba1d",
        "filter": "$.*",
        "fromId": "bd54b190-4747-4b82-a2b0-0b4851681059",
        "toId": "a8940d72-5eff-49ae-98f3-ac64e086ff8d"
      },
      {
        "id": "12e6cf18-84f2-41cd-bff2-1a211d93754d",
        "filter": "$",
        "fromId": "a8940d72-5eff-49ae-98f3-ac64e086ff8d",
        "toId": "cd4b6f24-d1b8-458d-815a-5dece4b147ac"
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
          "x": 204,
          "y": 360
        },
        "angle": 0,
        "tokens": 1,
        "id": "c49b0296-19cf-4857-90c0-3f93b638b877",
        "jsonnetsType": "place",
        "z": 4,
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
          "x": 552,
          "y": 360
        },
        "angle": 0,
        "tokens": 0,
        "id": "f1f4dfea-5277-4c6a-88f2-b76d3a12ce5d",
        "jsonnetsType": "place",
        "z": 5,
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
          "x": 1248,
          "y": 360
        },
        "angle": 0,
        "tokens": 0,
        "id": "cd4b6f24-d1b8-458d-815a-5dece4b147ac",
        "jsonnetsType": "place",
        "z": 6,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "Kamera"
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
          "x": 900,
          "y": 360
        },
        "angle": 0,
        "tokens": 0,
        "id": "bd54b190-4747-4b82-a2b0-0b4851681059",
        "jsonnetsType": "place",
        "z": 7,
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
        "type": "pn.Transition",
        "size": {
          "width": 100,
          "height": 50
        },
        "position": {
          "x": 348,
          "y": 360
        },
        "angle": 0,
        "id": "9ab06d0d-29d3-4580-bf44-8e36194e65f1",
        "jsonnetsType": "transition",
        "z": 14,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Montage"
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
          "x": 696,
          "y": 360
        },
        "angle": 0,
        "id": "7f9900f0-7d76-4067-b22e-391bdd91a101",
        "jsonnetsType": "transition",
        "z": 15,
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
          "y": 360
        },
        "angle": 0,
        "id": "a8940d72-5eff-49ae-98f3-ac64e086ff8d",
        "jsonnetsType": "transition",
        "z": 16,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Prüfung"
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
          "id": "c49b0296-19cf-4857-90c0-3f93b638b877",
          "selector": ".root"
        },
        "target": {
          "id": "9ab06d0d-29d3-4580-bf44-8e36194e65f1",
          "selector": ".root"
        },
        "id": "2fec368f-9bd4-41f2-bfb6-fd0901c9d325",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 17,
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
          "id": "9ab06d0d-29d3-4580-bf44-8e36194e65f1",
          "selector": ".root"
        },
        "target": {
          "id": "f1f4dfea-5277-4c6a-88f2-b76d3a12ce5d",
          "selector": ".root"
        },
        "id": "03a523fd-aa6c-4f9e-aebc-b30acdb1dc04",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 18,
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
          "id": "f1f4dfea-5277-4c6a-88f2-b76d3a12ce5d",
          "selector": ".root"
        },
        "target": {
          "id": "7f9900f0-7d76-4067-b22e-391bdd91a101",
          "selector": ".root"
        },
        "id": "6b836a80-ac07-4b53-b0ee-7367cb417425",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 19,
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
          "id": "7f9900f0-7d76-4067-b22e-391bdd91a101",
          "selector": ".root"
        },
        "target": {
          "id": "bd54b190-4747-4b82-a2b0-0b4851681059",
          "selector": ".root"
        },
        "id": "3e4a241e-f6b4-49fd-963a-485682dee440",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 20,
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
          "id": "bd54b190-4747-4b82-a2b0-0b4851681059",
          "selector": ".root"
        },
        "target": {
          "id": "a8940d72-5eff-49ae-98f3-ac64e086ff8d",
          "selector": ".root"
        },
        "id": "aee2a50a-3045-49ff-9a60-2a4bede9ba1d",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 21,
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
          "id": "a8940d72-5eff-49ae-98f3-ac64e086ff8d",
          "selector": ".root"
        },
        "target": {
          "id": "cd4b6f24-d1b8-458d-815a-5dece4b147ac",
          "selector": ".root"
        },
        "id": "12e6cf18-84f2-41cd-bff2-1a211d93754d",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 22,
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