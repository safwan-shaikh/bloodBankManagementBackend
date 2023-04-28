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

const deleteBank = async (req, res) => {
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

        const bags = await db.client.query(
            'select * from blood_bag where bb_id = $1 limit 1', [bank_id]
        );

        const hospital = await db.client.query(
            'select * from hospital_bank_rln where bank_id = $1 limit 1', [bank_id]
        );

        if (bags?.rows?.length > 0 || hospital?.rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Blood bank Cannot be deleted' });
        }

        await db.client.query(
            'delete from blood_bank where blood_bank_id = $1', [bank_id]
        );

        return res.status(200).send({ type: 'success', message: "Blood bank Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}
function buildWhere(filters) {
    if (Object.keys(filters)?.length > 0) {
        let toReturn = 'where '
        Object.keys(filters)?.forEach((key) => {
            switch (key) {
                case "b_name":
                    filters?.b_name?.length > 0 ? toReturn += `b_name ilike '%${filters?.b_name}%' and ` : null;
                    break;
                case "country":
                    filters?.country?.length > 0 ? toReturn += `country ilike '&${filters?.country}%' and ` : null;
                    break;
                case "phone":
                    filters?.phone?.length > 0 ? toReturn += `phone ilike '%${filters?.phone}%' and ` : null;
                    break;
                case "email":
                    filters?.email?.length > 0 ? toReturn += `email ilike '%${filters?.email}%' and ` : null;
                    break;
                default:
                    break;
            }
        });
        if (toReturn == 'where ') {
            return;
        } else {
            return toReturn.slice(0, -5);
        }
    } else {
        return;
    }
}
const getBanks = async (req, res) => {
    try {
        //add joi validations
        const body = req?.body;
        const { rows } = await db.client.query(
            `select * from blood_bank ${buildWhere(body?.filters || {})} order by blood_bank_id desc`
        );
        console.log({ query: `select * from blood_bank ${buildWhere(body?.filters || {})} order by blood_bank_id desc` })
        return res.status(200).send({ type: 'success', message: rows });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const getBankDonors = async (req, res) => {
    try {
        //add joi validations
        const bank_id = req.params['bank_id'];
        const body = req?.body;
        const { rows } = await db.client.query(
            `select bb2.bag_id as id,d.first_name as label from blood_bank bb inner join blood_bag bb2 on bb.blood_bank_id =bb2.bb_id inner join donor d on bb2.donor_id=d.donor_id where bb2.remaining_ml >= $1 and bb2.blood_type = $2 and bb2.expiry_date > $3 and bb.blood_bank_id = $4`,
            [body?.quantity_ml, body?.blood_type, new Date(), bank_id]
        );
        return res.status(200).send({ type: 'success', message: rows });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const getBankDetails = async (req, res) => {
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

        const bags = await db.client.query(
            'select * from blood_bag where bb_id = $1', [bank_id]
        );

        const hospitals = await db.client.query(
            'select * from hospital where hid in (select hospital_id from hospital_bank_rln where bank_id=$1) ', [bank_id]
        );

        let toReturn = {
            ...rows[0],
            bags: donations?.rows || [],
            hospitals: donatedTo?.rows || [],
        };

        return res.status(200).send({ type: 'success', message: toReturn });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}


module.exports = {
    createBank,
    updateBank,
    deleteBank,
    getBanks,
    getBankDonors,
    getBankDetails
}