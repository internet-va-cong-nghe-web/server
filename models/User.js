const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose=require('mongoose');

const UserSchema = new mongoose.Schema({
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
// favorites: {
//     type: Array,
//     default: []
// },
// comments: {
//     type: Array,
//     default: []
// }
});

const User = mongoose.model('user',UserSchema);

module.exports=User;