var cors = require('cors')  //use this
const path = require('path');
const express = require("express");
const dotenv = require("dotenv")
dotenv.config();
const router = express.Router();
const app = express();
//qs library
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

const oAuth2Server = require('./services/expressOAuthWrapper')

const oAuthModel = require("./controllers/auth/oauth.controller")
app.oauth = new oAuth2Server({
  model: oAuthModel,
  grants: ['auth_code', 'password', 'refresh_token'],
  debug: true,
  accessTokenLifetime: oAuthModel.accessTokenLifetime,
  refreshTokenLifetime: oAuthModel.refreshTokenLifetime,
  useErrorHandler: false,
  continueMiddleware: false,

});


//
const authRoute = require("./routes/auth/auth.router")(app, router);
const dashboardRoute = require("./routes/v1/customerDashboard.router")(app, router);
const adminRoute = require("./routes/v1/adminDashboard.router")(app, router);

//routes
app.use("/auth", authRoute);
app.use("/dashboard", dashboardRoute);
app.use("/dashboard", adminRoute);
// app.all('/oauth/token', app.oauth.grant());


const PORT = process.env.APP_PORT || 4111;
app.listen(PORT, console.log("Server started at port : " + PORT))