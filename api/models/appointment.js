const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        type: {
            type: String,
            enum: ['new', 'followup'],
        },
        reason: {
            type: String,
        },
        date: {
            type: Date,
        },
        email: {
            type: String,
        },
        hospital: {
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

module.exports = mongoose.model('Appointment', appointmentSchema);
