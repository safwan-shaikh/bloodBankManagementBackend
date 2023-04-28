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

const updateBloodBag = async (req, res) => {
    try {
        //add joi validations

        const bag_id = req.params['bag_id'];
        if (!bag_id) {
            return res.status(400).send({ type: 'error', message: 'Bag Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from blood_bag where bag_id = $1', [bag_id]
        );
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Blood bag does not exists' });
        }
        const body = req?.body;
        const remaining = Number(rows[0]?.remaining_ml) - Number(body?.quantity_ml);
        console.log({ remaining });
        const { result } = await db.client.query(
            'update blood_bag set remaining_ml = $1 where bag_id =$2',
            [remaining, bag_id]
        );

        await db.client.query(
            'insert into patient (first_name,last_name,gender,blood_type,dob,received_quantity_ml,received_at,blood_bag_id,hospital_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
            [body?.first_name, body?.last_name, body?.gender, body?.blood_type, body?.dob, body?.quantity_ml, new Date(), bag_id, body?.hospital?.id]
        );

        return res.status(200).send({ type: 'success', message: "Blood bag Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const deleteBloodBag = async (req, res) => {
    try {
        //add joi validations

        const bag_id = req.params['bag_id'];
        if (!bag_id) {
            return res.status(400).send({ type: 'error', message: 'Bag Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from blood_bag where bag_id = $1', [bag_id]
        );
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Blood bag does not exists' });
        }

        const patients = await db.client.query(
            'select * from blood_bag where donor_id = $1 limit 1', [donor_id]
        );

        if (patients?.rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Blood bag Cannot be deleted' });
        }

        await db.client.query(
            'delete from blood_bag where bag_id = $1', [bag_id]
        );

        return res.status(200).send({ type: 'success', message: "Blood bag Deleted Successfully" });
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
                    filters?.b_name?.length > 0 ? toReturn += `b_name ilike '${filters?.b_name}' and ` : null;
                    break;
                case "bloodType":
                    filters?.bloodType?.length > 0 ? toReturn += `blood_type = '${filters?.bloodType}' and ` : null;
                    break;
                case "donation_date":
                    filters?.donation_date?.length > 0 ? toReturn += `donation_date >= '${filters?.country}' and ` : null;
                    break;
                case "expiry_date":
                    filters?.expiry_date?.length > 0 ? toReturn += `expiry_date >= '${filters?.expiry_date}' and ` : null;
                    break;
                case "quantity_ml":
                    filters?.quantity_ml?.length > 0 ? toReturn += `quantity_ml => ${filters?.quantity_ml} and ` : null;
                    break;
                case "remaining_ml":
                    filters?.remaining_ml?.length > 0 ? toReturn += `remaining_ml >= ${filters?.remaining_ml} and ` : null;
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

const getBloodBags = async (req, res) => {
    try {
        //add joi validations
        const body = req?.body;
        const { rows } = await db.client.query(
            `select * from blood_bag bg inner join blood_bank bb on bg.bb_id=bb.blood_bank_id inner join donor d on bg.donor_id = d.donor_id ${buildWhere(body?.filters) || ''} order by bag_id desc`
        );

        return res.status(200).send({ type: 'success', message: rows });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const getBloodBagDetails = async (req, res) => {
    try {
        //add joi validations

        const bag_id = req.params['bag_id'];

        if (!bag_id) {
            return res.status(400).send({ type: 'error', message: 'Blood Bag Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from blood_bag bg inner join blood_bank bb on bg.bb_id=bb.blood_bank_id inner join donor d on bg.donor_id=d.donor_id where bag_id = $1', [bag_id]
        );

        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Blood bag does not exists' });
        }

        const donatedTo = await db.client.query(
            'select * from patient p where blood_bag_id = $1', [donor_id]
        );

        let toReturn = {
            ...rows[0],
            donatedTo: donatedTo?.rows || [],
        };

        return res.status(200).send({ type: 'success', message: toReturn });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

module.exports = {
    createBloodBag,
    updateBloodBag,
    deleteBloodBag,
    getBloodBags,
    getBloodBagDetails
}