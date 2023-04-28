const db = require("../db");
const jwt = require("jsonwebtoken");

const createBank = async (req, res) => {
    try {
        //add joi validations

        const { rows } = await db.client.query(
            'select blood_bank_id from blood_bank where phone = $1', [req?.body?.phone]
        );
        if (rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Blood bank already exists' });
        }
        const body = req?.body;
        const { result } = await db.client.query(
            'insert into blood_bank (b_name,phone,email,country,state,city,locality) values ($1,$2,$3,$4,$5,$6,$7)',
            [body?.b_name, body?.phone, body?.email, body?.country, body?.state, body?.city, body?.locality]
        );

        return res.status(200).send({ type: 'success', message: "Blood bank Created Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const updateBank = async (req, res) => {
    try {
        //add joi validations

        const bank_id = req.params['bank_id'];
        if (!bank_id) {
            return res.status(400).send({ type: 'error', message: 'Blood Bank Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from blood_bank where blood_bank_id = $1', [bank_id]
        );
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Blood bank does not exists' });
        }
        const body = req?.body;
        const { result } = await db.client.query(
            'update blood_bank set b_name=$1,email=$2,country=$3,state=$4,city=$5,locality=$6 where blood_bank_id = $7',
            [body?.b_name, body?.email, body?.country, body?.state, body?.city, body?.locality, bank_id]
        );

        return res.status(200).send({ type: 'success', message: "Blood bank Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}


module.exports = {
    createBank,
    updateBank
}