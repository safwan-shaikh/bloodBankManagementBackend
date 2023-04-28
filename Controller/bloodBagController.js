const db = require("../db");
const jwt = require("jsonwebtoken");

const createBloodBag = async (req, res) => {
    try {
        //add joi validations

        const { rows } = await db.client.query(
            'select bag_id from blood_bag where donor_id = $1', [req?.body?.donor_id]
        );
        if (rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Donor does not exists' });
        }

        const blood_bank = await db.client.query(
            'select bag_id from blood_bag where donor_id = $1', [req?.body?.donor_id]
        );
        if (blood_bank?.rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Blood Bank does not exists' });
        }

        const body = req?.body;
        const { result } = await db.client.query(
            'insert into blood_bag (blood_type,expiry_date,donation_date,quantity_ml,remaining_ml,bb_id,donor_id) values ($1,$2,$3,$4,$5,$6,$7) returning bag_id',
            [body?.blood_type, body?.expiry_date, body?.donation_date, body?.quantity_ml, body?.remaining_ml, body?.bb_id, body?.donor_id]
        );

        return res.status(200).send({ type: 'success', message: "Blood Bag Created Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

module.exports = {
    createBloodBag
}