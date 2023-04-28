const express = require('express')
const { createBank, updateBank, getBanks, getBankDonors } = require('../Controller/bankController');

const router = express.Router()

router.post('/createBank', createBank);

router.patch('/updateBank/:bank_id', updateBank);



router.post('/getBanks', getBanks);

router.post('/getBanksDonors/:bank_id', getBankDonors);

module.exports = router