export const startSchema = {
    "type": "array",
    "title": "start",
    "maxItems": 1,
    "items": {
        "type": "object",
    }
}

export const startMarking = [{ amount: 1, ghgFactor: 0, scope: 'start', pds: 0 }];

export const endSchema = {
    "type": "array",
    "title": "end",
    "maxItems": 1,
    "items": {
        "type": "object",
    }
}

export const endMarking = [];

export const controlSchema = {
    "type": "array",
    "title": "control",
    "maxItems": 1,
    "items": {
        "type": "object",
    }
}

export const controlMarking = [];



export const scope1Schema = {
    "type": "array",
    "title": "scope1",
    "maxItems": 1,
    "items": {
        "type": "object",
        "properties": {
            "scope": {
                "type": "number",
                "title": "Scope",
                "enum": [1],
                "readOnly": true
            },
            "amount": {
                "type": "number",
                "title": "Menge in g"
            },
            "thg": {
                "type": "string",
                "title": "Treibhausgas",
                "enum": [
                    "NF3",
                    "SF6",
                    "CF4",
                ],
                "default": "NF3"
            },
            "type": {
                "type": "string",
                "enum": [
                    "Primaerdaten"
                ],
                "title": "Datentyp",
                "readOnly": true
            }
        }
    }
}

export const scope1Marking = [
    {
        scope: 1,
        amount: 1,
        thg: "CO2",
        type: "Primaerdaten",
        pds: 1
    }
]


export const scope2Schema = {
    "type": "array",
    "title": "scope2",
    "maxItems": 1,
    "items": {
        "type": "object",
        "properties": {
            "scope": {
                "type": "number",
                "enum": [2],
                "title": "Scope",
                "readOnly": true
            },
            "ghgFactor": {
                "type": "number",
                "title": "Emissionsfaktor",
                "description": "Angabe des Emissionsfaktors je Mengeneinheit in kgCO2eq."
            },
            "amount": {
                "type": "number",
                "title": "Energieverbrauch in kWh"
            },
            "type": {
                "type": "string",
                "enum": [
                    "Primaerdaten"
                ],
                "title": "Datentyp",
                "readOnly": true
            }
        }
    }
};

export const scope2Marking = [{
    scope: 2,
    ghgFactor: 1,
    amount: 1,
    type: "Primaerdaten",
    pds: 1
}];

export const scope3Schema = {
    "type": "array",
    "title": "scope3",
    "maxItems": 1,
    "items": {
        "type": "object",
        "properties": {
            "scope": {
                "type": "number",
                "enum": [3],
                "readOnly": true
            },
            "ghgFactor": {
                "type": "number",
                "title": "Emissionsfaktor",
                "description": "Angabe des Emissionsfaktors je Mengeneinheit in kgCO2eq."
            },
            "amount": {
                "type": "number",
                "title": "Menge"
            },
            "unit": {
                "type": "string",
                "title": "Mengeneinheit",
                "enum": [
                    "cm2 (Flaeche)",
                    "g (Gewicht)",
                    "Stueck (Stueckzahl)"
                ]
            },
            "type": {
                "type": "string",
                "enum": [
                    "Sekundaerdaten"
                ],
                "title": "Datentyp",
                "readOnly": true,
            }
        }


    }
};

export const scope3Marking = [{
    scope: 3,
    ghgFactor: 1,
    amount: 1,
    unit: "Stueck (Stueckzahl)",
    type: "Sekundaerdaten",
    pds: 0

}]

export const productSchema = {
    "type": "array",
    "maxItems": 1,
    "items": {
        "type": "object",
        "properties": {
            "ghgFactor": {
                "type": "number",
                "title": "Emissionsfaktor",
                "readOnly": true,
            },
            "amount": {
                "type": "number",
                "title": "Menge",
                "enum": [1],
                "readOnly": true,
            },
            "unit": {
                "type": "string",
                "title": "Mengeneinheit",
                "enum": [
                    "Stueck (Stueckzahl)"
                ],
                "readOnly": true,
            },
            "pds": {
                "type": "number",
                "title": "Primaerdatenanteil",
                "readOnly": true,
            }
        }
    }
};

export const productMarking = [{
    scope: "product",
    ghgFactor: 1,
    amount: 1,
    unit: "Stueck (Stueckzahl)",
    pds: 0
}];

export const supplyChainSchema = {
    type: "array",
    title: "supply-chain",
    maxItems: 1,
    items: {
        type: "object",
        properties: {
            "scope": {
                "type": "number",
                "title": "Scope",
                "enum": [3],
                "readOnly": true
            },
            "ghgFactor": {
                "type": "number",
                "title": "Emissionsfaktor",
                "readOnly": true
            },
            "amount": {
                "type": "number",
                "title": "Menge"
            },
            "unit": {
                "type": "string",
                "title": "Mengeneinheit",
                "enum": ["Stueck (Stueckzahl)"],
                "readOnly": true
            },
            "pds": {
                "type": "number",
                "title": "Primaerdatenanteil",
                "readOnly": true
            }
        }
    }
};



export const s3tvalueSnippet = `{ scope: 'control', ghgFactor: totalFootprint, amount: 1, 
    unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', 
    pds: outputPDS, 
    footprintContributions: footprintContributions,
    sankeyNodes: sankeyNodes,
    sankeyLinks: sankeyLinks,
    nodeName: transition_name
};`;
export const s3tPreface = `
local thgFactors = {
  "NF3": 13.4,
  "SF6": 18.3,
  "CF4": 5.3
};

local sum(arr, n) = 
  if (n <= 0) then 0 
  else sum(arr, n-1) + arr[n-1];

local calculateFootprint(component) = 
  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100
  else component.amount * component.ghgFactor * Allokation / 100;


local individualFootprints = std.map(calculateFootprint,input_values);

local totalFootprint = sum(individualFootprints, std.length(individualFootprints));

local calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;

local footprintShares = std.map(calculatePCFShare,individualFootprints);

local calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;

local primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));

local outputPDS = sum(primaryDataShares,std.length(primaryDataShares));


// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created
local generateFootprintContribution(index,element) = if ((element.scope != "start") && (element.scope != "control")) 
  then { name: input_names[index], value: individualFootprints[index] };

local generateScope1Contribution(index,element) = if (element.scope == 1)
  then { name: input_names[index], value: individualFootprints[index] };

local generateScope2Contribution(index,element) = if (element.scope == 2)
  then { name: input_names[index], value: individualFootprints[index] };

local generateScope3Contribution(index,element) = if (element.scope == 3) 
  then { name: input_names[index], value: individualFootprints[index] };



local filterNull(element) = element != null;

local footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));
local scope1FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope1Contribution,input_values));
local scope2FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope2Contribution,input_values));
local scope3FromThisTransition = std.filter(filterNull,std.mapWithIndex(generateScope3Contribution,input_values));

// fetch contributions from incoming places
local filterControl(element) = element.scope == "control";

local incomingControlPlaces = std.filter(filterControl, input_values);

local getContribution(element) = element.footprintContributions;
local getScope1Contribution(element) = element.footprintContributions["1"];
local getScope2Contribution(element) = element.footprintContributions["2"];
local getScope3Contribution(element) = element.footprintContributions["3"];

local incomingScope1Contributions = std.flattenArrays(std.map(getScope1Contribution,incomingControlPlaces));
local incomingScope2Contributions = std.flattenArrays(std.map(getScope2Contribution,incomingControlPlaces));
local incomingScope3Contributions = std.flattenArrays(std.map(getScope3Contribution,incomingControlPlaces));

local footprintContributions = {
    "1": incomingScope1Contributions + scope1FromThisTransition,
    "2": incomingScope2Contributions + scope2FromThisTransition,
    "3": incomingScope3Contributions + scope3FromThisTransition,
};


// for each incoming place
local generateSankeyNode(index,element) = if (input_values[index].scope != "control") && (input_values[index].scope != "start") then { name: element };

local getNodes(element) = element.sankeyNodes;
local incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));

local sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];

//currently assuming we have exactly one output place
local generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };

local getLinks(element) = element.sankeyLinks;
local incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));

local controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];
local sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;

`;
//export const s3tPreface = `
//local thgFactors = {
//  "NF3": 13.4,
//  "SF6": 18.3,
//  "CF4": 5.3
//};
//
//local sum(arr, n) = 
//  if (n <= 0) then 0 
//  else sum(arr, n-1) + arr[n-1];
//
//local calculateFootprint(component) = 
//  if component.scope == 1 then component.amount * thgFactors[component.thg] * Allokation / 100
//  else component.amount * component.ghgFactor * Allokation / 100;
//
//
//local individualFootprints = std.map(calculateFootprint,input_values);
//
//local totalFootprint = sum(individualFootprints, std.length(individualFootprints));
//
//local calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;
//
//local footprintShares = std.map(calculatePCFShare,individualFootprints);
//
//local calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;
//
//local primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));
//
//local outputPDS = sum(primaryDataShares,std.length(primaryDataShares));
//
//
//// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created
//local generateFootprintContribution(index,element) = if ((element.scope != "start") && (element.scope != "control")) 
//  then { name: input_names[index], value: individualFootprints[index] };
//
//local filterNull(element) = element != null;
//
//local footprintContributionsFromThisTransition = std.filter(filterNull,std.mapWithIndex(generateFootprintContribution,input_values));
//
//// fetch contributions from incoming places
//local filterControl(element) = element.scope == "control";
//
//local incomingControlPlaces = std.filter(filterControl, input_values);
//
//local getContribution(element) = element.footprintContributions;
//
//local incomingContributions = std.flattenArrays(std.map(getContribution,incomingControlPlaces));
//
//local footprintContributions = incomingContributions + footprintContributionsFromThisTransition;
//
//
//// for each incoming place
//local generateSankeyNode(index,element) = if (input_values[index].scope != "control") && (input_values[index].scope != "start") then { name: element };
//
//local getNodes(element) = element.sankeyNodes;
//local incomingNodes = std.flattenArrays(std.map(getNodes,incomingControlPlaces));
//
//local sankeyNodes = incomingNodes + std.filter(filterNull,std.mapWithIndex(generateSankeyNode,input_names)) + [{ name: transition_name }];
//
////currently assuming we have exactly one output place
//local generateSankeyLink(element) = { source: element.name, value: element.value, target: transition_name };
//
//local getLinks(element) = element.sankeyLinks;
//local incomingLinks = std.flattenArrays(std.map(getLinks,incomingControlPlaces));
//
//local controlLink = if std.length(incomingControlPlaces) > 0 then [{ source: incomingControlPlaces[0].nodeName, target: transition_name, value: incomingControlPlaces[0].ghgFactor }] else [];
//local sankeyLinks = incomingLinks + std.map(generateSankeyLink,footprintContributionsFromThisTransition) + controlLink;
//
//`;
