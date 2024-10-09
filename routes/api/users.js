// const express = require('express');
//  const router = express.Router();
//  const {check, validationResult} = require('express-validator');
// //  const gravatar = require('gravatar');
// //  const bcrypt = require('bcryptjs');
//  const jwt = require('jsonwebtoken');
//  const config = require('config');
//  const mongoose=require('mongoose');
//  const User = require('../../models/User');

// router.get('/', async(req,res) =>{
//   try{
//     const users = await User.find({});
//     console.log(users);
//     res.json(users);
//     // User.find().then((result)=>{
//     //   res.send(result);
//     // }).catch((err)=>{
//     //     console.log(err);
//     // })
//   }catch(err){
//     res.status(500).json('server error');
//   }});

//   router.post(
//     '/post',
//     [
//       check('name', 'Name is required').not().isEmpty(),
//       check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
//       check('email', 'Please include a valid email').isEmail()
//     ],
//     async (req, res) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
     
//       // Destructure name, email, password from req.body
//       const { name, email, password } = req.body;
  
//       try {
       
//         // Check if user already exists
//         let user = await User.findOne({ email });
//         if (user) {
//           return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
//         }
  
//         // Create new instance of user
//         user = new User({
//           name,
//           email,
//           password
//         });
  
//         // Encrypt password using bcrypt
//         // const salt = await bcrypt.genSalt(10);
//         // user.password = await bcrypt.hash(password, salt);
  
//         // Save the user to the database
//         await user.save();
  
//         // Return JWT for authentication
//         const payload = {
//           user: {
//             id: user.id
//           }
//         };
  
//         jwt.sign(
//           payload,
//           config.get('jwtsecret'), //chưa có jwt secret
//           { expiresIn: 36000 }, // Token expires in 36000 seconds.
//           (err, token) => {
//             if (err) throw err;
//             res.json({ token });
//           }
//         );
//       } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//       }
//     }
//   );

//   module.exports=router;


const router = require("express").Router();
const { User, validate } = require("../../models/User");
const bcrypt = require('bcryptjs');

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;
