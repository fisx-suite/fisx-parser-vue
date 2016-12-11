fisx-parser-vue
======
> A fisx parser to compile the vue single file component support vue1 and vue2. 

## How to use

### Install

```shell
npm install fisx-parser-vue --save-dev
```

### Add configure to fis-conf.js

```js
// using vue1
fis.require('parser-vue').parser = require('fisx-vue1-loader');

// using vue2
// fis.require('parser-vue').parser = require('fisx-vue-loader');

fis.match('/src/(**.vue)', {
    rExt: 'vue.js',
    relative: true,
    parser: fis.plugin('vue', {
        script: {
            lang: 'babel'
        }
    }),
    preprocessor: [
        fis.plugin('babel'), // when 
        fis.plugin('amd')
    ]
});
```

* For Vue 1.x parser using [fisx-vue1-loader](https://github.com/wuhy/fisx-vue1-loader)

* For Vue 2.x parser using [fisx-vue-loader](https://github.com/wuhy/fisx-vue-loader)

If you using `babel-plugin-external-helpers` plugin, you can use [fisx-preprocessor-babel](https://github.com/wuhy/fisx-preprocessor-babel) preprocessor. If the module style is `commonjs`, you can use [fisx-preprocessor-amd](https://github.com/wuhy/fisx-preprocessor-amd) preprocessor to convert to amd module style.

### Options

* styleNameJoin - `string` `optional`: define the extracted style output file name join part, by default `vue-part`, e.g., the vue file is `a.vue`, the extracted style output file name is `a-vue-part.css`

* template - `Object` `optional`: define the template compile option, the detail option information refer `fisx-vue-loader` or `fisx-vue1-loader`.

* script - `Object` `optional`: define the script compile option, the detail option information refer `fisx-vue-loader` or `fisx-vue1-loader`.

* style - `Object` `optional`: define the style compile option, the detail option information refer `fisx-vue-loader` or `fisx-vue1-loader`.
