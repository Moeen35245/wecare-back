const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            required: true,
        },
        first_name: { type: String },
        last_name: { type: String },
        dob: {
            type: Date,
        },
        phone: { type: String },
        gender: { type: String, enum: ['m', 'f', 'o'] },
        alt_phone: { type: String },
        address: { type: String },
        emergency: {
            name: {
                type: String,
            },
            phone: {
                type: String,
            },
            relation: {
                type: String,
            },
        },
        history: {
            type: String,
        },
        treatments: {
            type: String,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

module.exports = mongoose.model('User', userSchema);
