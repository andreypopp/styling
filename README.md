Styling
=======

Style components with JavaScript.

Add the following configuration to `webpack.config.js`:

    module: {
      loaders: [
        {
          test: /\.styling\.js/,
          loader: 'style!css!styling!babel'
        }
      ]
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
