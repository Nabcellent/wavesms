import express, { Application } from "express";
import cookieParser from "cookie-parser";
import routes from './routes'

let path = require('path');
let logger = require('morgan');

let app: Application = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

export default app;
