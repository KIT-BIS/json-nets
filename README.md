# Prototypical implementation of a JSON-Nets editor

## Usage

This editor is available to try at https://kit-bis.github.io/json-nets/. 

Different JSON technologies can be used for inscriptions:
- Places are inscribed with [JSON-Schema](https://json-schema.org/).
- Arcs from places to transitions are inscribed with a [JSONPath-filter](https://github.com/dchester/jsonpath).
- Transitions and arcs from transitions to places are inscribed with [Jsonnet](https://jsonnet.org/).

**Disclaimer:** The editor is currently under heavy development and not production-ready. If you want to contribute, or have any comments, write an email to andreas.fritsch@kit.edu

Main Developer: Andreas Fritsch. Contributions: Martin Forell, Hanna Lagemann.

## Known issues

Email format is currently not supported for the JSON schema implementation.

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

- paths in index.html need to be manually changed from /* to /json-nets/* (can this be automated?)
