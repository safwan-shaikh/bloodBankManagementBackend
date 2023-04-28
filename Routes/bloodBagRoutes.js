const express = require('express')

const { createBloodBag, updateBloodBag, deleteBloodBag, getBloodBags, getBloodBagDetails } = require('../Controller/bloodBagController');

const router = express.Router()

router.post('/createBloodBag', createBloodBag);

router.patch('/updateBloodBag/:bag_id', updateBloodBag);

router.delete('/deleteBloodBag/:bag_id', deleteBloodBag);

router.post('/getBloodBags', getBloodBags);

router.get('/getBloodBag/:bag_id', getBloodBagDetails);

module.exports = router