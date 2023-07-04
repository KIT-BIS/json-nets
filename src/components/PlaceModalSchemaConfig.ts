export const testStyle = {
  arrayList: {
    addButton:
      'button level-item is-small my-add-button-spacer has-text-white has-text-weight-bold',
    label: 'label level-item',
    legend: 'level',
    item: 'level-left property-box',
    itemToolbar: 'level-item',
    itemContent: 'level-item',
    itemDelete: 'delete',
    itemWrapper: 'level remove-margin'
  },
  horizontalLayout: {
    item: 'my-horizontal-spacing',
    root: 'field is-horizontal'
  },
  group: {
    item: 'property-box'
  }
}

export const schema = {
  type: 'object',
  properties: {
    properties: {
      type: 'array',
      items: { $ref: '#/$defs/field' }
    }
  },

  $defs: {
    field: {
      type: 'object',
      properties: {
        type: { $ref: '#/$defs/type' },
        name: { $ref: '#/$defs/name' },
        properties: { $ref: '#/$defs/properties' },
        items: { $ref: '#/$defs/type' }
      }
    },
    type: {
      type: 'string',
      enum: ['string', 'number', 'integer', 'boolean', 'null', 'object', 'array']
    },
    name: { type: 'string' },
    properties: {
      type: 'array',
      items: { $ref: '#/$defs/field' }
    }
  }
}

export const nameAndTypeElements = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      scope: '#/properties/type'
    }
  ]
}

//const propertiesInArray = {
//  type: 'Control',
//  scope: '#/properties/properties',
//  options: {
//    detail: {
//      type: 'VerticalLayout',
//      elements: [nameAndTypeElements]
//    }
//  }
//}

const items = {
  type: 'Group',
  elements: [
    {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/items'
        },
        {
          type: 'Control',
          scope: '#/properties/properties',
          options: {
            detail: nameAndTypeElements
          },
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/items',
              schema: {
                const: 'object'
              }
            }
          }
        }
        // propertiesInArray
      ]
    }
  ],
  rule: {
    effect: 'SHOW',
    condition: {
      scope: '#/properties/type',
      schema: {
        const: 'array'
      }
    }
  }
}
const properties = {
  type: 'Control',
  scope: '#/properties/properties',
  options: {
    detail: {
      type: 'VerticalLayout',
      elements: [
        nameAndTypeElements,
        {
          type: 'Control',
          scope: '#/properties/properties',
          options: {
            detail: {
              type: 'VerticalLayout',
              elements: [nameAndTypeElements]
            }
          },
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/type',
              schema: {
                const: 'object'
              }
            }
          }
        },
        items
      ]
    }
  },
  rule: {
    effect: 'SHOW',
    condition: {
      scope: '#/properties/type',
      schema: {
        const: 'object'
      }
    }
  }
}

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/properties',
      options: {
        detail: {
          type: 'VerticalLayout',
          elements: [nameAndTypeElements, items, properties]
        }
      }
    }
  ]
}