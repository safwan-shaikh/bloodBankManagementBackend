const express = require('express')

const { createBloodBag, updateBloodBag, deleteBloodBag, getBloodBags } = require('../Controller/bloodBagController');

const router = express.Router()

router.post('/createBloodBag', createBloodBag);

router.patch('/updateBloodBag/:bag_id', updateBloodBag);

router.delete('/deleteBloodBag/:bag_id', deleteBloodBag);

router.post('/getBloodBags', getBloodBags);

module.exports = router