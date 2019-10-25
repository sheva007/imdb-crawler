import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import AppRoutes from "./routes";
var helmet = require('helmet');

const port = process.env.PORT || 3000;

// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests
createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(cors())
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(helmet());

    // register all application routes
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: Request, response: Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    });

    // run app
    app.listen(port, () => {

        console.log(`server started. on ${port}`);

    });

}).catch(error => console.log("TypeORM connection error: ", error));
