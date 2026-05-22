const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        storeName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isSeller: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

sellerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

sellerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
