import { corsOptions } from "./interfaces/corsOptions"
import { Express, Request, Response } from "express";
import { Server, IncomingMessage, ServerResponse } from 'http';

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app: Express = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const corsOptions: corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))

const port: number = 4000
const server: Server<typeof IncomingMessage, typeof ServerResponse> = app.listen(port, (): void => {
    console.log(`Server started on port ${port}`)
})