'use strict';
import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import 'dotenv/config'
import passportconfig from './config/passport-config.js';
import baseconfig from './config/config.js';
import authrouteconfig from './auth-routes.js';
import cors from 'cors';
import { 
    studentTable,
    teacherTable,
    departmentTable,
    careerTable,
    degreeTable,
    groupTable,
    thesisProposalTable,
    applicationTable
} from './dbentities.js';
import { psqlDriver } from './dbdriver.js';

const env = process.env.NODE_ENV || 'development';
const currentStrategy = process.env.PASSPORT_STRATEGY || 'saml';
const config = baseconfig[env][currentStrategy];

passportconfig(passport, config, currentStrategy);

const app = express();

app.set('port', config.app.port);
app.use(morgan('dev'));
const corsOptions = {
    origin: `http://localhost:${config.app.frontend_port}`,
    credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session(
  {
    resave: currentStrategy === 'local' ? false : true,
    saveUninitialized: currentStrategy === 'local' ? false : true,
    secret: 'this is a secret'
  }));
app.use(passport.initialize());
app.use(passport.session());

authrouteconfig(app, config, passport, currentStrategy);

const server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

export { server, app, psqlDriver };