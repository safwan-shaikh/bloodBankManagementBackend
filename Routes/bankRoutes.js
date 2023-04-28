const express = require('express')
const { createBank, updateBank } = require('../Controller/bankController');

const router = express.Router()

router.post('/createBank', createBank);

router.patch('/updateBank/:bank_id', updateBank);



module.exports = router