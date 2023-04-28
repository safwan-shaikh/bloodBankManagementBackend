//importing modules
//const bcrypt = require("bcrypt");
const moment = require("moment");
const db = require("../db");
const jwt = require("jsonwebtoken");

const createDonor = async (req, res) => {
    try {
        //add joi validations
        console.log({ req: req?.body?.phone });
        const { rows } = await db.client.query(
            'select donor_id from donor where phone = $1', [req?.body?.phone]
        );
        if (rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Donor already exists' });
        }
        const body = req?.body;
        const result = await db.client.query(
            'insert into donor (first_name,last_name,gender,blood_type,country,state,city,locality,phone,email,dob,created_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning donor_id',
            [body?.first_name, body?.last_name, body?.gender, body?.blood_type, body?.country, body?.state, body?.city, body?.locality, body?.phone, body?.email, body?.dob, body?.created_at]
        );

        await db.client.query(
            'insert into blood_bag (blood_type,expiry_date,donation_date,quantity_ml,remaining_ml,bb_id,donor_id) values ($1,$2,$3,$4,$5,$6,$7)',
            [body?.blood_type, moment(body?.created_at).add(45, 'days'), body?.created_at, body?.quantity_ml, body?.quantity_ml, body?.bb_id, result?.rows[0]?.donor_id]
        );
        console.log({ result: result?.rows });
        return res.status(200).send({ type: 'success', message: "User Created Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const updateDonor = async (req, res) => {
    try {
        //add joi validations

        const donor_id = req.params['donor_id'];
        if (!donor_id) {
            return res.status(400).send({ type: 'error', message: 'Donor Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from donor where donor_id = $1', [donor_id]
        );
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Donor does not exists' });
        }
        const body = req?.body;
        const { result } = await db.client.query(
            'update donor set first_name=$1,last_name=$2,gender=$3,blood_type=$4,country=$5,state=$6,city=$7,locality=$8,email=$9,dob=$10,created_at=$11 where donor_id = $12',
            [body?.first_name, body?.last_name, body?.gender, body?.blood_type, body?.country, body?.state, body?.city, body?.locality, body?.email, body?.dob, body?.created_at, donor_id]
        );

        return res.status(200).send({ type: 'success', message: "User Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const deleteDonor = async (req, res) => {
    try {
        //add joi validations

        const donor_id = req.params['donor_id'];
        if (!donor_id) {
            return res.status(400).send({ type: 'error', message: 'Donor Id is Required' });
        }

        const d_details = await db.client.query(
            'select * from donor where donor_id = $1', [donor_id]
        );
        if (d_details?.rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Donor does not exists' });
        }

        const { rows } = await db.client.query(
            'select * from blood_bag where donor_id = $1 limit 1', [donor_id]
        );

        if (rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Donor Cannot be deleted' });
        }

        await db.client.query(
            'delete from donor where donor_id = $1', [donor_id]
        );

        return res.status(200).send({ type: 'success', message: "User Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const getDonors = async (req, res) => {
    try {
        //add joi validations
        const body = req?.body;
        const { rows } = await db.client.query(
            `select * from donor ${buildWhere(body?.filters)} order by donor_id desc`
        );
        console.log({ dquery: `select * from donor ${buildWhere(body?.filters)} order by donor_id desc` })
        return res.status(200).send({ type: 'success', message: rows });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const getDonorDetails = async (req, res) => {
    try {
        //add joi validations

        const donor_id = req.params['donor_id'];
        if (!donor_id) {
            return res.status(400).send({ type: 'error', message: 'Donor Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from donor where donor_id = $1', [donor_id]
        );

        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Donor does not exists' });
        }

        const donations = await db.client.query(
            'select * from blood_bag where donor_id = $1', [donor_id]
        );

        const donatedTo = await db.client.query(
            'select p.hospital_id ,p.first_name ,p.last_name ,p.gender ,p.dob ,p.received_at ,p.received_quantity_ml,p.pid from blood_bag bb inner join patient p on bb.bag_id = p.blood_bag_id where bb.donor_id=$1', [donor_id]
        );

        let toReturn = {
            ...rows[0],
            donations: donations?.rows || [],
            donatedTo: donatedTo?.rows || [],
        };

        return res.status(200).send({ type: 'success', message: toReturn });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}


module.exports = {
    createDonor,
    updateDonor,
    deleteDonor,
    getDonors,
    getDonorDetails
}