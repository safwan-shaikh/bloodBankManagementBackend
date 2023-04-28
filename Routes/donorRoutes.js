const express = require('express')
const {createDonor, updateDonor, deleteDonor, getDonors} = require("../Controller/donorController");

const router = express.Router()

router.post('/createDonor', createDonor);

router.patch('/updateDonor/:donor_id', updateDonor);

router.delete('/deleteDonor/:donor_id', deleteDonor);

router.post('/getDonors', getDonors);

module.exports = router