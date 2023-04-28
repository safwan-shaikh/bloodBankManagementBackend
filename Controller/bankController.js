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
module.exports = {
    createBank
}