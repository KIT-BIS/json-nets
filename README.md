# JSON-Nets editor

## Description

JSON-Nets editor is a highly adaptable process modelling tool that combines Petri Nets principles with the JSON data model and can be configured for different application domains. For example, it has been used in the [Scope3transparent](https://www.scope3transparent.de) project, funded in the German National Climate Initiative, as a carbon analysis tool (Scope3tool) for electronics production processes.

For more information on the underlying concepts, see our [paper on JSON-Nets](https://link.springer.com/chapter/10.1007/978-3-031-34241-7_3). For more information on its usage in the Scope3transparent project see our [paper on Scope3tool](https://ieeexplore.ieee.org/document/10631250).

## Usage

You can try the configuration for carbon analysis (Scope3tool) [online](https://kit-bis.github.io/json-nets/#/scope3tool). Scope3tool supports modelling of processes, integration of carbon footprint data, simulations and visualization of simulation results. Further instructions are available in the tool.

The basic configuration of the JSON-Nets editor is available to try [here](https://kit-bis.github.io/json-nets/). Usage requires knowledge of the JSON syntax as well as different JSON technologies for inscriptions:
- Places are inscribed with [JSON-Schema](https://json-schema.org/).
- Arcs are inscribed with a [JSONPath](https://github.com/dchester/jsonpath).
- Transitions are inscribed with [Jsonnet](https://jsonnet.org/).

## Roadmap

Note that the editor is a research prototoype and not production-ready. We are currently working on the following features:

- Extended simulation support
- Improved support for custom configurations
- Improved support for data exchange with external APIs
- Additional QoL-Features like copy/paste of model elements

## Contributing

If you want to contribute, or have any comments, write an email to andreas.fritsch@kit.edu

## Authors

**Main Developer:** Andreas Fritsch. **Contributions:** Martin Forell, Hanna Lagemann, Thomas Sowa.

## Development 

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Deployment on github pages

Paths in index.html need to be manually changed from /* to /json-nets/*

## License

JSON-Nets editor is published under MIT license. If you use the JSON-Nets editor in your research work, please cite our [paper on JSON-Nets](https://link.springer.com/chapter/10.1007/978-3-031-34241-7_3).

## Acknowlegment

The project Scope3transparent is supported by the Federal Ministry for Economic Affairs and Climate Action (BMWK) as part of the National Climate Initiative on the basis of a decision by the German Bundestag.