## Auth Security
is an application that allow authenticated users add and manage secrets. <br>
This uses [OAuth](https://oauth.net/) with [Passportjs](http://www.passportjs.org/) for authentication. <br>

___


## Technologies
Auth Security was developed with JavaScript (ES6), Node.js using [Express 4](http://expressjs.com/). <br/>
with [EJS](https://ejs.co/)  

___


## API Information
API endpoints URL - http://localhost:3000/

|METHOD  |DESCRIPTION                           |ENDPOINT              |
|------- |------------------------------------- |----------------------|
|GET     |Get home page                         |                      |
|GET     |Get User registration form            |register              |
|GET     |Get User login form                   |login                 |
|GET     |Get google User authorization         |auth/google           |
|GET     |Get google callback url               |auth/google/secrets   |
|GET     |Authenticated User get secrets        |secrets               |
|GET     |Logout authenticated User             |logout                |
|GET     |Authenticated User get secret form    |submit                |
|POST    |Post registration form                |register              |
|POST    |Post login form                       |login                 |
|POST    |Post secret form                      |submit                |


___


## Running Locally

Make sure you have [Node.js](http://nodejs.org/) 12.14.1 installed and [POSTMAN](https://www.getpostman.com/downloads/).

```sh
git clone git@github.com:emma50/Auth-Security.git
cd Auth-Security
npm install
npm start
```

Auth Security should now be running on [localhost:3000](http://localhost:3000/).

___

## Author
### Okwuidegbe Emmanuel Ikechukwu