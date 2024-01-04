const mongoose = require('mongoose')
import { Schema, InferSchemaType } from 'mongoose'

interface UserObject {
    login: string
    email: string
    password: string
    posts: number
    comments: number
    type: "user" | "moderator" | "admin"
    lastActive: Date
    entryDate: Date
}

const userSchema = new Schema<UserObject>({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    posts: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: "user"
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    entryDate: {
        type: Date,
        default: Date.now
    }
})
const Users: InferSchemaType<typeof userSchema> = mongoose.model('Users', userSchema, 'users')

const mySchemas: {[key: string]: InferSchemaType<typeof userSchema>} = {'Users':Users}
module.exports = mySchemas