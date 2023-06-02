const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const checkAuth = require('../middleware/checkAuth');
const Appointment = require('../models/appointment');

router.post('/book', checkAuth, (req, res) => {
    const appointment = new Appointment({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        hospital: req.body.hospital,
        type: req.body.type,
        reason: req.body.reason,
        date: req.body.date,
    });

    appointment
        .save()
        .then((result) => {
            res.status(201).json({
                _id: result._id,
                email: result.email,
                hospital: result.hospital,
                type: result.type,
                reason: result.reason,
                date: appointment.date,
                message: 'appointment created',
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err, message: 'error3' });
        });
});

router.post('/', checkAuth, (req, res) => {
    Appointment.find({ email: req.body.email })
        .exec()
        .then((appointment) => {
            if (appointment.length < 1) {
                return res.status(200).json({ message: 'no appointment found' });
            } else
                return res
                    .status(200)
                    .json({ message: 'All appointments', data: appointment, length: appointment.length });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;
