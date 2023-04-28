const express = require('express')

const { createBloodBag, updateBloodBag } = require('../Controller/bloodBagController');

const router = express.Router()

router.post('/createBloodBag', createBloodBag);

router.patch('/updateBloodBag/:bag_id', updateBloodBag);



module.exports = router