const express = require('express')
const { createBank, updateBank, getBanks, deleteBank, getBankDonors, getBankDetails } = require('../Controller/bankController');

const router = express.Router()

router.post('/createBank', createBank);

router.patch('/updateBank/:bank_id', updateBank);

router.delete('/deleteBank/:bank_id', deleteBank);

router.post('/getBanks', getBanks);

router.post('/getBanksDonors/:bank_id', getBankDonors);

router.get('/getBank/:bank_id', getBankDetails);

module.exports = router