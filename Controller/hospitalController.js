//importing modules
//const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

const createHospital = async (req, res) => {
    try {
        //add joi validations
        const body = req?.body;
        if (!body?.bloodBanks) {
            return res.status(400).send({ type: 'error', message: 'Blood banks are required' });
        }

        const { rows } = await db.client.query(
            'select hid from hospital where phone = $1', [req?.body?.phone]
        );
        if (rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Hospital already exists' });
        }
        db.client.query('BEGIN');
        const result = await db.client.query(
            'insert into hospital (hname,phone,email,country,state,city,locality) values ($1,$2,$3,$4,$5,$6,$7) returning hid',
            [body?.hname, body?.phone, body?.email, body?.country, body?.state, body?.city, body?.locality]
        );

        for (let i = 0; i < body?.bloodBanks?.length; i++) {
            let bank = body?.bloodBanks[i];
            await db.client.query(
                'insert into hospital_bank_rln (hospital_id,bank_id,created_on) values ($1,$2,$3)',
                [result?.rows[0]?.hid, bank?.id, new Date()]
            );
        }
        db.client.query('COMMIT');
        return res.status(200).send({ type: 'success', message: "Hospital Created Successfully" });
    } catch (error) {
        console.log(error);
        db.client.query('ROLLBACK');
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const updateHospital = async (req, res) => {
    try {
        //add joi validations

        const h_id = req.params['h_id'];
        if (!h_id) {
            return res.status(400).send({ type: 'error', message: 'Hospital Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from hospital where hid = $1', [h_id]
        );
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Hospital does not exists' });
        }
        const body = req?.body;
        const { result } = await db.client.query(
            'update hospital set hname=$1,email=$2,country=$3,state=$4,city=$5,locality=$6 where hid = $7',
            [body?.hname, body?.email, body?.country, body?.state, body?.city, body?.locality, h_id]
        );

        if (body?.bloodBanks?.length > 0) {
            const relatedBanks = await db.client.query(
                'select bank_id from hospital_bank_rln where hospital_id=$1',
                [h_id]
            );
            const bankIds = relatedBanks?.rows?.map((bank) => bank?.bank_id);
            for (let i = 0; i < body?.bloodBanks?.length; i++) {
                let bank = body?.bloodBanks[i];
                if (!bankIds?.includes(bank?.id)) {
                    await db.client.query(
                        'insert into hospital_bank_rln (hospital_id,bank_id,created_on) values ($1,$2,$3)',
                        [h_id, bank?.id, new Date()]
                    );
                }
            }
        }
        return res.status(200).send({ type: 'success', message: "Hospital Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const deleteHospital = async (req, res) => {
    try {
        //add joi validations

        const h_id = req.params['h_id'];
        if (!h_id) {
            return res.status(400).send({ type: 'error', message: 'Hospital Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from hospital where hid = $1', [h_id]
        );
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Hospital does not exists' });
        }

        const bank_hosp = await db.client.query(
            'select * from hospital_bank_rln where h_id = $1 limit 1', [h_id]
        );

        const patients = await db.client.query(
            'select * from patient where hospital_id = $1 limit 1', [h_id]
        );

        if (bank_hosp?.rows?.length > 0 || patients?.rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Hospital Cannot be deleted' });
        }

        await db.client.query(
            'delete from hospital where hid = $1', [h_id]
        );

        return res.status(200).send({ type: 'success', message: "Hospital Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

module.exports = {
    createHospital,
    updateHospital,
    deleteHospital
}