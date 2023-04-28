const express = require('express')

const { createBloodBag, updateBloodBag, deleteBloodBag } = require('../Controller/bloodBagController');

const router = express.Router()

router.post('/createBloodBag', createBloodBag);

router.patch('/updateBloodBag/:bag_id', updateBloodBag);

router.delete('/deleteBloodBag/:bag_id', deleteBloodBag);

module.exports = router