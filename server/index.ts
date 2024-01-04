import { corsOptionsObject } from "./interfaces/corsOptions"
import { Express, Request, Response } from "express";
import { Server, IncomingMessage, ServerResponse } from 'http';
const router = require('./routes/router')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv/config')

const app: Express = express()

const corsOptions: corsOptionsObject = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect(process.env.DB_URI)
    .then(() => console.log('DB Connected'))
    .catch((err: Error): void=> console.log(err))

app.use(cors(corsOptions))
app.use('/', router)

const port: string | number = process.env.PORT || 4000
const server: Server<typeof IncomingMessage, typeof ServerResponse> = app.listen(port, (): void => {
    console.log(`Server started on port ${port}`)
})