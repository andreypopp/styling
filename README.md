Styling
=======

Styling is the [Webpack][] based tool to write component styles with the full
power of JavaScript:
```js
import styling from 'styling'
import {baseColor} from './theme'

export let button = styling({
  backgroundColor: baseColor
})
```
Why
---

* Modules, variables, functions, all of these works out of the box because you
  use JavaScript.

* Rich ecosystem of ready to use [npm][] packages: for example you can use
  [color][] for color manipulation.

* Compatability with the existent CSS tools such as [autoprefixer][] and a ton
  of other [PostCSS][] transforms.

* Compatability with the existent JS tools such as compile-to-js languages
  (CoffeeScript, TypeScript), type checkers (FlowType), linters (ESLint) and
  others.

How
---

Styling is implemented as a [Webpack][] loader which executes JavaScript code to
produce *styling* objects.

Each styling object is then converted to a [CSS module][] and passed further to
Webpack CSS processing pipeline (usually css-loader and style-loader).

Consuming styling styles is no different than consuming a CSS module: you get a
mapping of CSS class names which can be used to style your components.

Limitations
-----------

You should still keep your UI code and your stylesheet code separate as
stylesheet code executes during bundling and doesn't have any runtime
representation.

Installation
------------

Install from [npm][]:
```bash
% npm install styling
```
Usage
-----

Add the following configuration to `webpack.config.js`:
```js
var styling = require('styling')

module.exports = {
  module: {
    loaders: [
      {
        test: /\.style\.js/,
        loader: styling(
          ['style', css'], // loaders to execute after styling
          ['babel']        // loaders to execute before styling
        )
      }
    ]
  }
}
```
Function `styling` configures loader and accepts two arguments, one for
*postloaders* and one for *preloaders*.

Now you can write styles with the full power of JavaScript, `Button.style.js`:
```js
import styling from 'styling'

export let self = styling({
  backgroundColor: 'red',
  borderWidth: 1 + 10,

  hover: {
    borderWidth: 100
  }
})
```
And consume them, `Button.js`:
```js
import ButtonStyle from './Button.style'

export function render() {
  return `<button className="${ButtonStyle.self}">Click!</button>`
}
```
Usage with Extract Text Webpack plugin
--------------------------------------

Styling is compatible with [extract-text-webpack-plugin][] so you can have your
styles extracted into a separate CSS bundle by Webpack. This is how you
configure it to do so:
```js
var styling = require('styling')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
  module: {
    loaders: [
      {
        test: /\.style\.js/,
        loader: styling(ExtractTextWebpackPlugin.extract('style', css'), 'babel')
      }
    ]
  },

  plugins: [
    new ExtractTextWebpackPlugin('bundle.css')
  ]
}
```
[npm]: http://npmjs.org
[Webpack]: http://webpack.github.io/
[extract-text-webpack-plugin]: https://github.com/webpack/extract-text-webpack-plugin
[color]: https://www.npmjs.com/package/color
[CSS module]: https://github.com/css-modules/css-modules
[autoprefixer]: https://github.com/postcss/autoprefixer
[PostCSS]: http://postcss.parts/
