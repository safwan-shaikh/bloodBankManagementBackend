const express = require('express')
const { createBank } = require('../Controller/bankController');

const router = express.Router()

router.post('/createBank', createBank);

module.exports = router