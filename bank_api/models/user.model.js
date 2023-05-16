import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'Please provide your first name'] },
    lastName: { type: String, required: [true, 'Please provide your last name'] },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide valid email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email'
        }

    },
    username: {
        type: String,
        required: [true, 'Please provide your username'],
        unique: true
    },
    password: { type: String, required: [true, 'Please provide your password'] },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

},
    {
        timestamps: true
    });

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.method('comparePassword', async function (inputPassword) {
    const isMatch = await bcrypt.compare(inputPassword, this.password);
    return isMatch;
});

UserSchema.method('create_jwt', async function (isRefresh) {
    let jwtoken = '';
    if (!isRefresh.check) {
        jwtoken = jwt.sign(
            { userId: this._id, role: this.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        return jwtoken;
    } else {
        jwtoken = jwt.sign(
            { userId: this._id, username: this.username, refresh: isRefresh.refreshToken },
            process.env.REFRESH_JWT_SECRET_KEY,
            { expiresIn: process.env.REFRESH_JWT_EXPIRES_IN }
        );
        return jwtoken;
    }
});

const Users = mongoose.model(
    'users',
    UserSchema
);

export default Users;