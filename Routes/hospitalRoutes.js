const express = require('express')
const { createDonor, updateDonor, deleteDonor, getDonors, getDonorDetails } = require("../Controller/donorController");
const { createBank, updateBank, deleteBank, getBanks, getBankDetails } = require('../Controller/bankController');
const { createHospital, updateHospital, deleteHospital, getHospital, getHospitalDetails, getHospitalBanks } = require('../Controller/hospitalController');

const router = express.Router()

router.post('/createHospital', createHospital);

router.patch('/updateHospital/:h_id', updateHospital);

router.delete('/deleteHospital/:h_id', deleteHospital);

router.post('/getHospitals', getHospital);

router.get('/getHospitalBanks/:h_id', getHospitalBanks)

router.get('/getHospital/:h_id', getHospitalDetails);

//router.post('/assign_project/employee/:emp_id/project/:proj_id',assign_project);

module.exports = router