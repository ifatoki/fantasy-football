# Fantasy Football

A RESTful API for a simple application where football/soccer fans will create fantasy teams and will be able to sell or buy players.

## API Documentation

The documentation for the API can be found [here](https://documenter.getpostman.com/view/2602351/UyxjHmcP)

## Dependencies

### Development Dependencies

The following depencies are required by the app during developmment

- eslint - A javascript syntax highlighter used to highlight code error and encourage convention

### App Dependencies

- express - Web server for this application
- json-loader - Enables the app to inport json files.
- lodash - Used to perform filter on objects
- pg, pg-hstore, sequelize - Used to create database models and for performing database operations
- validator - Used to validate user input during server request

## Installation and setup

Before you install the app locally, ensures you have [NodeJS](https://nodejs.org/en/#) and [PostgreSQL](https://www.postgresql.org/) installed on your computer.

- Navigate to a directory of choice on `terminal`

- Clone this repository on that directory.

- Using SSH,

  `git clone git@git.toptal.com:screening/Itunu-Fatoki.git`

  and https,

  `git clone https://git.toptal.com/screening/Itunu-Fatoki`

- Navigate into project directory by running `cd Itunu-Fatoki`

- Run `npm install` to install project dependencies

- Start the app by running `npm run dev`

## Contributing

Contributors are welcome to further enhance the features of this API by contributing to its development. The following guidelines should guide you in contributing to this project:

- Fork this repository to your own account.
- Download/Clone a forked copy of tthe repository to your local machine.
- Create a new branch: `git checkout -b new-branch-name`.
- Install the dependencies using `npm install`.
- Run `npm install` to install project dependencies
- To run application unit tests: `npm test`.
- Work on a new feature and push to your remote branch: `git push origin your-branch-name`
- Raise a pull request to the staging branch of this repo.
- This project uses javascript ES6 and follows the airbnb style-guide: <https://github.com/airbnb/javascript>
