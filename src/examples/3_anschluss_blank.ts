export const data = {
  "netData": {
    "places": [
      {
        "id": "167bbbd6-95ec-4fd6-be40-26c1a487f170",
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
          "$id": "167bbbd6-95ec-4fd6-be40-26c1a487f170"
        }
      },
      {
        "id": "77993295-6870-418a-bd0d-b145e603292f",
        "name": "p1",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "77993295-6870-418a-bd0d-b145e603292f"
        }
      },
      {
        "id": "2f69a08e-2351-4bdf-84d7-564928a829aa",
        "name": "p2",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "control",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "2f69a08e-2351-4bdf-84d7-564928a829aa"
        }
      },
      {
        "id": "834fca4a-9079-417a-8768-afd52bcc0c94",
        "name": "Kameraanschluss",
        "marking": [],
        "schema": {
          "type": "array",
          "title": "end",
          "maxItems": 1,
          "items": {
            "type": "object"
          },
          "$id": "834fca4a-9079-417a-8768-afd52bcc0c94"
        }
      }
    ],
    "transitions": [
      {
        "id": "67438c44-8f16-41b3-ac44-0438014633c0",
        "name": "Reinigen",
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
        "id": "e6d19788-6dec-476e-a333-14397384d651",
        "name": "Löten",
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
        "id": "480049a0-4dbe-4f96-b7fc-2fdd039ed064",
        "name": "Trennen",
        "preface": "\n// calculations\n\n// ghg factors in kg CO2e per g\nlocal ghgFactors = {\n  \"NF3\": 13.4,\n  \"SF6\": 18.3,\n  \"CF4\": 5.3\n};\n\nlocal calculateFootprint(component) = \n  component.amount  *\n  (if component.scope == 1 then \n    (if component.unit == \"mg\" then 0.001 \n    else if component.unit == \"kg\" then 1000 \n    else 1)\n    * ghgFactors[component.ghg]\n    * component.scalingFactor\n  else if component.scope == 2 then\n    (if component.unit == \"Wh\" then 0.001\n    else 1)\n    * component.ghgFactor *\n    (if component.ghgFactorUnit == \"g CO2e / kWh\" then 0.001\n    else if component.ghgFactorUnit == \"mg CO2e / kWh\" then 0.000001\n    else 1)\n    * component.scalingFactor\n  else if component.scope == 3 then\n    (if component.unit == \"mg (Gewicht)\" then 0.000001\n    else if component.unit == \"g (Gewicht)\" then 0.001\n    else 1)\n    * component.ghgFactor * \n    (if component.ghgFactorUnit == \"mg CO2e / Stueck oder kg\" then 0.000001\n    else if component.ghgFactorUnit == \"g CO2e / Stueck oder kg\" then 0.001\n    else 1)\n    * component.scalingFactor\n  else component.ghgFactor)\n  * Allokation / 100;\n\n\nlocal individualFootprints = std.map(calculateFootprint,input_values);\n\n\n// calculate Scope 1-Emissions\n\n\n\nlocal generateScope1Contribution(index,element) = if (element.scope == 1)\n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal sum(arr, n) = \n  if (n <= 0) then 0 \n  else sum(arr, n-1) + arr[n-1];\n\n\nlocal totalFootprint = sum(individualFootprints, std.length(individualFootprints));\n\nlocal calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;\n\nlocal footprintShares = std.map(calculatePCFShare,individualFootprints);\n\nlocal calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;\n\nlocal primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));\n\nlocal outputPDS = sum(primaryDataShares,std.length(primaryDataShares));\n\n\n// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created\nlocal generateFootprintContribution(index,element) = if ((element.scope != \"start\") && (element.scope != \"control\")) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\nlocal generateScope2Contribution(index,element) = if (element.scope == 2)\n  then { name: input_names[index], value: individualFootprints[index] };\n\nlocal generateScope3Contribution(index,element) = if (element.scope == 3) \n  then { name: input_names[index], value: individualFootprints[index] };\n\n\n\nlocal filterNull(element) = element != null;\n\nlocal footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));\nlocal scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));\nlocal scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));\nlocal scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));\n\n// fetch contributions from incoming places\nlocal filterControl(element) = element.scope == \"control\";\n\nlocal incomingControlPlaces = std.filter(filterControl, input_values);\n\nlocal getContribution(element) = element.footprintContributions;\nlocal getScope1Contribution(element) = element.footprintContributions[\"1\"];\nlocal getScope2Contribution(element) = element.footprintContributions[\"2\"];\nlocal getScope3Contribution(element) = element.footprintContributions[\"3\"];\n\nlocal incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));\nlocal incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));\nlocal incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));\n\nlocal footprintContributions = {\n    \"1\": incomingScope1Contributions + scope1FromThisTransition,\n    \"2\": incomingScope2Contributions + scope2FromThisTransition,\n    \"3\": incomingScope3Contributions + scope3FromThisTransition,\n};\n\n\n// for each incoming place\nlocal generateSankeyNode(index,element) = if (input_values[index].scope != \"control\") && (input_values[index].scope != \"start\") then { name: element };\n\nlocal getNodes(element) = element.sankeyNodes;\nlocal incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));\n\nlocal sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];\n\n//currently assuming we have exactly one output place\nlocal generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };\n\nlocal getLinks(element) = element.sankeyLinks;\nlocal incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));\n\nlocal controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];\nlocal sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;\n\n",
        "guard": "true",
        "customVariables": {
          "Allokation": "100"
        },
        "keyVarSnippets": {
          "output_kameraanschluss_key": "local output_kameraanschluss_key = '-';"
        },
        "fragmentVarSnippets": {
          "output_kameraanschluss_value": "local output_kameraanschluss_value = { \n    scope: 'control', \n    ghgFactorUnit: 'kg CO2e / Stueck',\n    ghgFactor: totalFootprint, \n    amount: 1, \n    unit: 'Stueck (Stueckzahl)', \n    type: 'Primaerdaten', \n    pds: outputPDS, \n    footprintContributions: footprintContributions,\n    sankeyNodes: sankeyNodes,\n    sankeyLinks: sankeyLinks,\n    nodeName: transition_name\n};"
        }
      }
    ],
    "arcs": [
      {
        "id": "9005b5ac-3466-4378-8277-3332c51a2afe",
        "filter": "$.*",
        "fromId": "167bbbd6-95ec-4fd6-be40-26c1a487f170",
        "toId": "67438c44-8f16-41b3-ac44-0438014633c0"
      },
      {
        "id": "55fe0403-4136-4ace-8504-60e737ca6bef",
        "filter": "$",
        "fromId": "67438c44-8f16-41b3-ac44-0438014633c0",
        "toId": "77993295-6870-418a-bd0d-b145e603292f"
      },
      {
        "id": "e983560b-dfff-4fd4-ad18-21f9e485d471",
        "filter": "$.*",
        "fromId": "77993295-6870-418a-bd0d-b145e603292f",
        "toId": "e6d19788-6dec-476e-a333-14397384d651"
      },
      {
        "id": "c20f81e1-d19b-46b4-9262-438307da4af6",
        "filter": "$",
        "fromId": "e6d19788-6dec-476e-a333-14397384d651",
        "toId": "2f69a08e-2351-4bdf-84d7-564928a829aa"
      },
      {
        "id": "26da7c32-e6b0-4221-9a5b-2ccb9ce7560b",
        "filter": "$.*",
        "fromId": "2f69a08e-2351-4bdf-84d7-564928a829aa",
        "toId": "480049a0-4dbe-4f96-b7fc-2fdd039ed064"
      },
      {
        "id": "3826748f-3eb9-49d9-8d2a-54ae1952f284",
        "filter": "$",
        "fromId": "480049a0-4dbe-4f96-b7fc-2fdd039ed064",
        "toId": "834fca4a-9079-417a-8768-afd52bcc0c94"
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
          "y": 312
        },
        "angle": 0,
        "tokens": 1,
        "id": "167bbbd6-95ec-4fd6-be40-26c1a487f170",
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
          "x": 528,
          "y": 312
        },
        "angle": 0,
        "tokens": 0,
        "id": "77993295-6870-418a-bd0d-b145e603292f",
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
          "x": 876,
          "y": 312
        },
        "angle": 0,
        "tokens": 0,
        "id": "2f69a08e-2351-4bdf-84d7-564928a829aa",
        "jsonnetsType": "place",
        "z": 6,
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
          "x": 1284,
          "y": 312
        },
        "angle": 0,
        "tokens": 0,
        "id": "834fca4a-9079-417a-8768-afd52bcc0c94",
        "jsonnetsType": "place",
        "z": 7,
        "attrs": {
          ".root": {
            "stroke": "hsl(204, 71%, 39%)",
            "stroke-width": 3
          },
          ".label": {
            "fill": "#7a7e9b",
            "text": "Kameraanschluss"
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
          "y": 312
        },
        "angle": 0,
        "id": "67438c44-8f16-41b3-ac44-0438014633c0",
        "jsonnetsType": "transition",
        "z": 8,
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
          "x": 683,
          "y": 311
        },
        "angle": 0,
        "id": "e6d19788-6dec-476e-a333-14397384d651",
        "jsonnetsType": "transition",
        "z": 9,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Löten"
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
          "y": 312
        },
        "angle": 0,
        "id": "480049a0-4dbe-4f96-b7fc-2fdd039ed064",
        "jsonnetsType": "transition",
        "z": 10,
        "attrs": {
          ".label": {
            "fill": "#7a7e9b",
            "text": "Trennen"
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
          "id": "167bbbd6-95ec-4fd6-be40-26c1a487f170",
          "selector": ".root"
        },
        "target": {
          "id": "67438c44-8f16-41b3-ac44-0438014633c0",
          "selector": ".root"
        },
        "id": "9005b5ac-3466-4378-8277-3332c51a2afe",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 11,
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
          "id": "67438c44-8f16-41b3-ac44-0438014633c0",
          "selector": ".root"
        },
        "target": {
          "id": "77993295-6870-418a-bd0d-b145e603292f",
          "selector": ".root"
        },
        "id": "55fe0403-4136-4ace-8504-60e737ca6bef",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 12,
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
          "id": "77993295-6870-418a-bd0d-b145e603292f",
          "selector": ".root"
        },
        "target": {
          "id": "e6d19788-6dec-476e-a333-14397384d651",
          "selector": ".root"
        },
        "id": "e983560b-dfff-4fd4-ad18-21f9e485d471",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 13,
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
          "id": "e6d19788-6dec-476e-a333-14397384d651",
          "selector": ".root"
        },
        "target": {
          "id": "2f69a08e-2351-4bdf-84d7-564928a829aa",
          "selector": ".root"
        },
        "id": "c20f81e1-d19b-46b4-9262-438307da4af6",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 14,
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
          "id": "2f69a08e-2351-4bdf-84d7-564928a829aa",
          "selector": ".root"
        },
        "target": {
          "id": "480049a0-4dbe-4f96-b7fc-2fdd039ed064",
          "selector": ".root"
        },
        "id": "26da7c32-e6b0-4221-9a5b-2ccb9ce7560b",
        "jsonnetsType": "preset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 15,
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
          "id": "480049a0-4dbe-4f96-b7fc-2fdd039ed064",
          "selector": ".root"
        },
        "target": {
          "id": "834fca4a-9079-417a-8768-afd52bcc0c94",
          "selector": ".root"
        },
        "id": "3826748f-3eb9-49d9-8d2a-54ae1952f284",
        "jsonnetsType": "postset",
        "connector": {
          "name": "straight",
          "args": {
            "cornerType": "cubic"
          }
        },
        "z": 16,
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