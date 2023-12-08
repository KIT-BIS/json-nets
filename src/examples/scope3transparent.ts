export const scope1Schema = {
  "type": "array",
  "minItems": 1,
  "maxItems": 1,
  "items": {
    "type": "object",
    "properties": {
      "data": {
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
  }
}

export const scope1Marking = [ { data: 
    {
        scope: 1,
        amount: 1,
        thg: "CO2",
        type: "Primaerdaten",
        pds: 1
    } }
]


export const scope2Schema = {
  "type": "array",
  "minItems": 1,
  "maxItems": 1,
  "items": {
    "type": "object",
    "properties": {
      "data": {
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
    }
  }
};

export const scope2Marking = [{ data: {
    scope: 2,
    ghgFactor: 1,
    amount: 1,
    type: "Primaerdaten",
    pds: 1
}}];

export const scope3Schema = {
  "type": "array",
  "minItems": 1,
  "maxItems": 1,
  "items": {
    "type": "object",
    "properties": {
      "data": {
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
    }
  }
};

export const scope3Marking = [{ data: {
    scope: 3,
    ghgFactor: 1,
    amount: 1,
    unit: "Stueck (Stueckzahl)",
    type: "Sekundaerdaten",
    pds: 0

}}]

export const productSchema = {
  "type": "array",
  "minItems": 1,
  "maxItems": 1,
  "items": {
    "type": "object",
    "properties": {
      "data": {
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
    }
  }
};

export const productMarking = [{
    data: {
        scope: "product",
        ghgFactor: 1,
        amount: 1,
        unit: "Stueck (Stueckzahl)",
        pds: 0
    }
}];

export const supplyChainSchema = {
    type: "array",
    minItems: 1,
    maxItems: 1,
    items: {
      type: "object",
      properties: { data: { type: "object",
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
    }}
    }
  };



export const s3tvalueSnippet = "{ scope: 'product', ghgFactor: totalFootprint, amount: 1, unit: 'Stueck (Stueckzahl)', type: 'Primaerdaten', pds: outputPDS, footprintContributions: std.mapWithIndex(generateFootprintContribution,input_values), pdsContributions: std.mapWithIndex(generatePdsContribution,input_values), names: input_names };";
export const s3tPreface = `local thgFactors = {
  "NF3": 13.4,
  "SF6": 18.3,
  "CF4": 5.3
};

local sum(arr, n) = 
  if (n <= 0) then 0 
  else sum(arr, n-1) + arr[n-1];

local calculateFootprint(component) = 
  if component.data.scope == 1 then component.data.amount * thgFactors[component.data.thg]
  else component.data.amount * component.data.ghgFactor;


local individualFootprints = std.map(calculateFootprint,input_values);

local totalFootprint = sum(individualFootprints, std.length(individualFootprints));

local calculatePCFShare(partFootprint) = partFootprint/totalFootprint;

local footprintShares = std.map(calculatePCFShare,individualFootprints);

local calculatePrimaryDataShare(index) = footprintShares[index] * input_values[index].data.pds;

local primaryDataShares = std.map(calculatePrimaryDataShare,std.range(0,std.length(input_values)-1));

local outputPDS = sum(primaryDataShares,std.length(primaryDataShares));

local generateFootprintContribution(index,element) = { name: input_names[index], value: individualFootprints[index] };

local generatePdsContribution(index,element) = { name: input_names[index], value: primaryDataShares[index] };`;