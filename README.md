# node-express-framework
This code is created as a step forward to MVC framework sample implementation. Migration module is introduced here in order to minimize the direct interaction with database and making queries less complex. Data seed functionality is also introduced.

Please contribute towards the code!!

For install,use

<b>npm install</b>

once done, for running migration,

<b>npm run migrate</b>

for seed, 

<b>npm run seed</b>

for undo migrate,

<b>npm run undo-migrate</b>

<b><u>Note:</u></b>
Pending work : for now migration file name need to be changed in package.json for executing a migration. Need to automate this and maintain a migration table to keep track of all migrations. for eg in below part of code in package.json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "migrate": "babel-node ./db/migrations/migration_009_02062022 createAllTables",
    "undo-migrate": "babel-node ./db/migrations/migration_001_31012022 dropAllTables",
    "seed": "babel-node ./db/seeds/seed_001_01022022 seed",
    "start": "nodemon index.js"
  },
  
  <h2>AWS support</h2>
  AWS services are implemented as sample code. Current services used : 
  <ul>
  <li>AWS Textract</li>
  <li>AWS S3</li>
  </ul>
  
  <h2>PDF support</h2>
  for reading a pdf (password protected or not) below repo is used which can be  modified further for more support. This is just Q-PDF improved wrapper tseted for both windows and linux environment.
  <b>github:gauravpant1306/qpdf-js</b>
  
  <h2>Database</h2>
  Currently postgre DB is used for code. Need support to add more database wrapper for easy to implement code
  
  <h2>SMS and Email Support</h2>
  for sms and email, templates as well as sample code is implemented. Just need to change sample .env file for proper credentials.
  
  <h2>Utilities</h2>
  Common validation utilities are included for validation purpose</h2>
  
  <h1>O-Auth</h1>
  
 custom express o-auth wrapper is written for o-auth support. Tested and working o-auth code currently support bearer token, can be modified for opaque tokens and added encryption/decryption functionality
