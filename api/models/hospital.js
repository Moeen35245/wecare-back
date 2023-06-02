const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dname: {
        type: String,
        require: true,
    },
    hod: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    speciality: {
        type: String,
        require: true,
    },
});

const hospitalSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            require: true,
        },
        logo: {
            type: String,
            require: true,
        },
        address: {
            type: String,
            max: 100,
            require: true,
        },
        departments: [departmentSchema],
        email: {
            type: String,
            require: true,
        },
        helpline: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

module.exports = mongoose.model('Hospital', userSchema);
