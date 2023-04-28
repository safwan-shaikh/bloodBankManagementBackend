const express = require('express')
const {createDonor, updateDonor, deleteDonor} = require("../Controller/donorController");

const router = express.Router()

router.post('/createDonor', createDonor);

router.patch('/updateDonor/:donor_id', updateDonor);

router.delete('/deleteDonor/:donor_id', deleteDonor);
module.exports = router