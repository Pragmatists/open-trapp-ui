[![Build Status](https://travis-ci.org/Pragmatists/open-trapp-ui.svg?branch=master)](https://travis-ci.org/Pragmatists/open-trapp-ui)
[![Coverage Status](https://coveralls.io/repos/github/Pragmatists/open-trapp-ui/badge.svg?branch=master)](https://coveralls.io/github/Pragmatists/open-trapp-ui?branch=master)

# OpenTrappUI
Open Time Registration Application

## GitHub Pages
This code is deployed to GitHub Pages.

Website is available [here](https://pragmatists.github.io/open-trapp-ui/).

## Available Scripts

In the project directory, you can run:

- `npm start`  
    Runs the app in the development mode.<br>
    Open [http://localhost:4200](http://localhost:4200) to view it in the browser.
    The page will reload if you make edits.<br>
    You will also see any lint errors in the console.

- `npm test`  
    Launches the test runner in the interactive watch mode.<br>
    See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

- `npm run build`  
    Builds the app for production to the `build` folder.<br>
    It correctly bundles React in production mode and optimizes the build for the best performance.
    The build is minified and the filenames include the hashes.<br>
    Your app is ready to be deployed!
    
    See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

- `npm run eject`  
    **Note: this is a one-way operation. Once you `eject`, you can’t go back!**
    If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. 
    This command will remove the single build dependency from your project.
    
## Sources

### Work log entry parser
To parse work log expression `pegjs` library is used.

Grammar is defined in file `workLogExpressionParser/WorkLogEntryGrammar.pegjs`.

After each change it's necessary to generate `js` file. To do so you should execute command 
```bash
npm run generate-parser
```

After that you have to add `import moment from 'moment';` at the very top of generated file and suppress ts errors. 
