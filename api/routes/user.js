const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const sendMail = require('../helper/sendmail');
const checkAuth = require('../middleware/checkAuth');

router.post('/send_otp', async (req, res, next) => {
    res.status(201).json({ otp: otp });
});

router.post('/signup', (req, res, next) => {
    const otp = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
    });

    console.log(req.body.email);

    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            // console.log(user);
            if (user.length >= 1) {
                // check if email already exist and its status is active
                if (user[0].active === true) return res.status(422).json({ message: `User already exist` });
                // if email already exist but its status not true
                else if (user[0].active === false) {
                    bcrypt.hash(req.body.password, 10, async (err, hash) => {
                        if (err) {
                            return res.status(500).json({ error: err, msg: 'bcrypt failed' });
                        } else {
                            await sendMail(otp, req.body.email);
                            User.updateOne(
                                { email: user[0].email },
                                {
                                    $set: { password: hash, otp: otp },
                                }
                            )
                                .then((result) => {
                                    res.status(201).json({
                                        _id: result._id,
                                        email: result.email,
                                        message: 'user created with update 1',
                                    });
                                })
                                .catch((err) => {
                                    res.status(500).json({ error: 'error2' });
                                });
                            // res.status(201).json({ message: 'Update user' });
                        }
                    });
                }
            } else {
                bcrypt.hash(req.body.password, 10, async (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err, msg: 'bcrypt failed' });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            otp: otp,
                        });
                        await sendMail(otp, req.body.email);
                        user.save()
                            .then((result) => {
                                res.status(201).json({ _id: result._id, email: result.email, message: 'user created' });
                            })
                            .catch((err) => {
                                res.status(500).json({ error: err, message: 'error3' });
                            });
                    }
                });
            }
        });
});

router.post('/verify_otp', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length < 1) {
                return res.status(401).json({ message: 'Email not exist' });
            } else if (user[0].otp !== req.body.otp) {
                return res.status(401).json({ message: 'Otp is invalid' });
            } else {
                User.updateOne(
                    { email: user[0].email },
                    {
                        $set: { active: true },
                    }
                )
                    .then((result) => {
                        res.status(201).json({
                            _id: result._id,
                            email: result.email,
                            message: 'Otp verified',
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({ error: 'error4' });
                    });
            }
        });
});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length < 1 || user[0].active === false) {
                return res.status(401).json({ message: 'Auth failed' });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: 'Auth failed' });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                        },
                        'moinuddin',
                        {
                            expiresIn: '1h',
                        }
                    );

                    return res.status(200).json({ message: 'Auth successful', token: token });
                }
                res.status(401).json({ message: 'Auth failed' });
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

router.post('/add_user', checkAuth, (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length < 1 || user[0].active === false) {
                return res.status(404).json({ message: 'User not exists' });
            } else {
                User.updateOne(
                    { email: user[0].email },
                    {
                        $set: {
                            first_name: req.body.firstName,
                            last_name: req.body.lastName,
                            phone: req.body.phone,
                            dob: req.body.dob,
                            gender: req.body.gender,
                            address: req.body.address,
                        },
                    }
                )
                    .then((result) => {
                        res.status(201).json({
                            _id: result._id,
                            email: result.email,
                            message: 'user added',
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({ error: 'error4' });
                    });
            }
        });
});

router.post('/is_new', checkAuth, (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            console.log(user[0].phone);
            if (user[0].phone) {
                res.status(201).json({ isNew: false, message: 'user details already filled' });
            } else {
                res.status(201).json({ isNew: true, message: 'user is new' });
            }
        })
        .catch((err) => res.status(500).json({ err: err, message: 'something went wrong' }));
});

// router.delete('/:userId', (req, res, next) => {
//     const id = req.params.userId;

//     User.remove({ _id: id })
//         .exec()
//         .then((user) => {
//             res.status(200).json({ user: user, message: 'user deleted' });
//         })
//         .catch((err) => {
//             res.status(500).json({ error: err });
//         });
// });

module.exports = router;
