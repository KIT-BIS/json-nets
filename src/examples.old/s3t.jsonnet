local input_values= [  {
    "scope": 1,
    "amount": 1,
    "unit": "g",
    "ghg": "NF3",
    "scalingFactor": 0.5,
    "type": "Primaerdaten",
    "pds": 1
  },{
    scope: 2,
    unit: "kWh",
    amount: 1,
    ghgFactorUnit: "kg CO2e / kWh",
    ghgFactor: 1,
    "scalingFactor": 1,
    type: "Primaerdaten",
    pds: 1
},{
    scope: 3,
    unit: "kg (Gewicht)",
    amount: 1,
    ghgFactorUnit: "kg CO2e / Stueck oder kg",
    ghgFactor: 1,
    "scalingFactor": 0.5,
    type: "Sekundaerdaten",
    pds: 0

}
  ];

local input_names = ["scope1_input","scope2_input","scope3_input"];

local Allokation = 100;

local transition_name = "this_transition";

// calculations

// ghg factors in kg CO2e per g
local ghgFactors = {
  "NF3": 13.4,
  "SF6": 18.3,
  "CF4": 5.3
};

local calculateFootprint(component) = 
  component.amount  *
  (if component.scope == 1 then 
    (if component.unit == "mg" then 0.001 
    else if component.unit == "kg" then 1000 
    else 1)
    * ghgFactors[component.ghg]
    * component.scalingFactor
  else if component.scope == 2 then
    (if component.unit == "Wh" then 0.001
    else 1)
    * component.ghgFactor *
    (if component.ghgFactorUnit == "g CO2e / kWh" then 0.001
    else if component.ghgFactorUnit == "mg CO2e / kWh" then 0.000001
    else 1)
    * component.scalingFactor
  else if component.scope == 3 then
    (if component.unit == "mg (Gewicht)" then 0.000001
    else if component.unit == "g (Gewicht)" then 0.001
    else 1)
    * component.ghgFactor * 
    (if component.ghgFactorUnit == "mg CO2e / Stueck oder kg" then 0.000001
    else if component.ghgFactorUnit == "g CO2e / Stueck oder kg" then 0.001
    else 1)
    * component.scalingFactor
  else component.ghgFactor)
  * Allokation / 100;


local individualFootprints = std.map(calculateFootprint,input_values);


// calculate Scope 1-Emissions



local generateScope1Contribution(index,element) = if (element.scope == 1)
  then { name: input_names[index], value: individualFootprints[index] };



local sum(arr, n) = 
  if (n <= 0) then 0 
  else sum(arr, n-1) + arr[n-1];


local totalFootprint = sum(individualFootprints, std.length(individualFootprints));

local calculatePCFShare(partFootprint) = if totalFootprint > 0 then partFootprint/totalFootprint else 0;

local footprintShares = std.map(calculatePCFShare,individualFootprints);

local calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].pds;

local primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));

local outputPDS = sum(primaryDataShares,std.length(primaryDataShares));


// for each emission input (not start or control-flow place) an object containing name and ghg-emission as value is created
local generateFootprintContribution(index,element) = if ((element.scope != "start") && (element.scope != "control")) 
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

{
 scope: 'control', 
 ghgFactor: totalFootprint, 
 amount: 1, 
 unit: 'Stueck (Stueckzahl)', 
 type: 'Primaerdaten', 
    pds: outputPDS, 
    footprintContributions: footprintContributions,
    sankeyNodes: sankeyNodes,
    sankeyLinks: sankeyLinks,
    nodeName: transition_name

}