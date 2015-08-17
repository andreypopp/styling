styling-example-extract
=======================

This is an example of using styling to write component styles which are then
extracted into a separate CSS chunk.

Build:

    % npm install .
    % npm run webpack

Project description:

    ├── webpack.config.js   Webpack config
    ├── Button.js           Component
    ├── Button.style.js     Component styles
    └── Theme.js            Theme constants (used by styles)

Build output desciption:

    build/
    ├── bundle.css          Built styles
    └── bundle.js           Built code
