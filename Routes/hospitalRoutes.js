const express = require('express')
const { createDonor, updateDonor, deleteDonor, getDonors, getDonorDetails } = require("../Controller/donorController");
const { createBank, updateBank, deleteBank, getBanks, getBankDetails } = require('../Controller/bankController');
const { createHospital, updateHospital, deleteHospital} = require('../Controller/hospitalController');

const router = express.Router()

router.post('/createHospital', createHospital);

router.patch('/updateHospital/:h_id', updateHospital);

router.delete('/deleteHospital/:h_id', deleteHospital);

module.exports = router