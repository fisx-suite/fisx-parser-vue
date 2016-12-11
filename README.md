fisx-parser-vue
======
> A parser to compile the vue single file component support vue1 and vue2. 

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

* Vue 1.x parser using [fisx-vue1-loader](https://github.com/wuhy/fisx-vue1-loader)

* Vue 2.x parser using [fisx-vue-loader](https://github.com/wuhy/fisx-vue-loader)

**Tip** if you using `babel-plugin-external-helpers` plugin, you can use [fisx-preprocessor-babel](https://github.com/wuhy/fisx-preprocessor-babel) preprocessor. If the module style is `commonjs`, you can use [fisx-preprocessor-amd](https://github.com/wuhy/fisx-preprocessor-amd) preprocessor to convert to amd module style.

### Options

* babelHelperModId - `string` `optional`: define the babel helpers module id, by default `babelHelpers`

* disableBabel - `boolean` `optional`: if the processed file has disableBabel configure with `true`, the preprocessor will ignore this file
