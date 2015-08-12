Styling
=======

Styling allows to define component styles with the full power of JavaScript.

Why
---

* Modules, variables, functions, all of these works out of the box because you
  use JavaScript.

* Rich ecosystem of ready to use [npm][] packages: for example you can use
  [color][] for color manipulation.

* Compatability with the existent CSS tools such as [autoprefixer][] and a ton
  of other [PostCSS][] transforms.

How
---

Styling is implemented as a [webpack][] loader which executes JavaScript code to
produce *styling* objects.

Each styling object is then converted to a [CSS module][] and passed further to
webpack CSS processing pipeline (usually css-loader and style-loader).

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

    % npm install styling

Usage
-----

Add the following configuration to `webpack.config.js`:

    module.exports = {
      module: {
        loaders: [
          {
            test: /\.style\.js/,
            loader: 'style!css!styling!babel'
          }
        ]
      }
    }

Now you can write styles with the full power of JavaScript, `Button.styling.js`:

    import styling from 'styling'

    export let self = styling({
      backgroundColor: 'red',
      borderWidth: 1 + 10,

      hover: {
        borderWidth: 100
      }
    })

And consume them, `Button.js`:

    import ButtonStyle from './Button.styling'

    export function render() {
      return `<button className="${ButtonStyle.self}">Click!</button>`
    }

Usage with Extract Text Webpack plugin
--------------------------------------

Styling is compatible with [extract-text-webpack-plugin][] so you can have your
styles extracted into a separate CSS bundle by Webpack. This is how you
configure it to do so:

    module.exports = {
      module: {
        loaders: [
          {
            test: /\.style\.js/,
            loader: ExtractTextWebpackPlugin.extract('style', css!styling!babel')
          }
        ]
      },

      plugins: [
        new ExtractTextWebpackPlugin('bundle.css')
      ]
    }

[npm]: http://npmjs.org
[webpack]: http://webpack.github.io/
[extract-text-webpack-plugin]: https://github.com/webpack/extract-text-webpack-plugin
[color]: https://www.npmjs.com/package/color
[CSS module]: https://github.com/css-modules/css-modules
[autoprefixer]: https://github.com/postcss/autoprefixer
[PostCSS]: http://postcss.parts/
