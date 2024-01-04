import { Router, Request, Response} from 'express';
import { Schema, InferSchemaType } from 'mongoose'
import { RegisterUserObject, RegisterUserRequest } from '../interfaces/RouterTypes';

const express = require('express')
const schemas = require('../models/schemas')
const router: Router = express.Router()

router.post('/api/register', async (req: RegisterUserRequest, res: Response): Promise<void> => {
    const { login, email, password }: RegisterUserObject = req.body
    const userData: RegisterUserObject = {login: login, email: email, password: password}

    const newUser: InferSchemaType<typeof schemas.Users> = new schemas.Users(userData)

    const saveUser: InferSchemaType<typeof schemas.Users> = await newUser.save()
    if (saveUser) {
        res.json({message: 'User registered successfully', user: saveUser})
    } else {
        res.status(400).json({message: 'Failed to register user'})
    }
})
module.exports = router