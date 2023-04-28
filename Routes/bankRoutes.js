const express = require('express')
const { createBank, updateBank, getBanks } = require('../Controller/bankController');

const router = express.Router()

router.post('/createBank', createBank);

router.patch('/updateBank/:bank_id', updateBank);



router.post('/getBanks', getBanks);

module.exports = router