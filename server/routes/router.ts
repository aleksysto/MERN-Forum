import { Router, Request, Response} from 'express';
const express = require('express')
const router: Router = express.Router()

router.get('/', (req: Request, res: Response<{message: string}>) => {
    res.send({message: 'witam swiat'})
})

module.exports = router