// const express = require('express');
// const router = express.Router();
// const {check, validationResult} = require('express-validator');
// const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const mongoose=require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
// },
// email: {
//     type: String,
//     required: true
// },
// password: {
//     type: String,
//     required: true
// }
// // favorites: {
// //     type: Array,
// //     default: []
// // },
// // comments: {
// //     type: Array,
// //     default: []
// // }
// });

// const User = mongoose.model('user',UserSchema);

// module.exports=User;




const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const config = require('config');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, config.get('jwtSecret'), {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().label("Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
