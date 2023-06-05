// from https://stackoverflow.com/questions/722668/traverse-all-the-nodes-of-a-json-object-tree-with-javascript
function traverse(o, func) {
    for (var i in o) {
        func.apply(this, [i, o[i]]);
        if (o[i] !== null && typeof (o[i]) == "object") {
            //going one step down in the object tree!!
            traverse(o[i], func);
        }
    }
}

function objectTypesFromSchemaToJsonFormsData(key,schemaFragment) {
    if (schemaFragment.properties) {
        let newProps = [];
        let keys = Object.keys(schemaFragment.properties)
        for (let i = 0; i < keys.length; i++) {
            let newProp = schemaFragment.properties[keys[i]];
            newProp.name = keys[i];
            //newProp.type = value.properties[keys[i]].type;
            newProps.push(newProp);
        }
        schemaFragment.properties = newProps;
        //value.key = newProps;
    }
}

function arrayTypesFromSchemaToJsonFormsData(key,schemaFragment) {
    if (schemaFragment.items) {
        if (schemaFragment.items.properties) {
            schemaFragment.properties = schemaFragment.items.properties;
        }
        schemaFragment.items = schemaFragment.items.type;
    }
}

export function transferSchemaToJsonFormsData(schema) {
    const jsonFormsData = JSON.parse(schema);

    traverse(jsonFormsData, arrayTypesFromSchemaToJsonFormsData);
    objectTypesFromSchemaToJsonFormsData("",jsonFormsData);
    traverse(jsonFormsData, objectTypesFromSchemaToJsonFormsData);


    return jsonFormsData;

};

function objectAndArrayTypesFromFormsDataToSchema(key,value) {
    if (value.properties && value.type !== "array") {
      let newProps = {}
      for (let i = 0; i < value.properties.length; i++) {
        if (value.properties[i].name) {
          newProps[value.properties[i].name] = value.properties[i];
          delete newProps[value.properties[i].name].name;
        }
      }
      value.properties = newProps;
      value.type = "object";
      //value.key = newProps;
    }
    if (value.type === "array" && value.items){
      if (value.items === "object" && value.properties) {
        value.items = { type: value.items, properties: value.properties };
        delete value.properties;
      } else {
        value.items = { type: value.items };
      }
    }
}

export function transferJsonFormsDataToSchema(formsData) {
    const schema = JSON.parse(formsData);

//      let processedData = JSON.parse(JSON.stringify(this.data));
    traverse(schema, objectAndArrayTypesFromFormsDataToSchema);
    objectAndArrayTypesFromFormsDataToSchema("", schema);
//      if (processedData.properties) {
//        let newProps = {}
//        for (let i = 0; i < processedData.properties.length; i++) {
//          if (processedData.properties[i].name) {
//            newProps[processedData.properties[i].name] = processedData.properties[i];
//            delete newProps[processedData.properties[i].name].name;
//          }
//          console.log(processedData.properties[i])
//        }
//        processedData.properties = newProps;
//        processedData.type = "object";
//
//      }
//
//
    return schema;
}