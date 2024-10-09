// const express = require('express');
// const router = express.Router();
// const auth = require('../../middleware/auth');
// const User = require('../../models/User');

// // Route: GET api/auth
// // Mục đích: Lấy thông tin người dùng đã đăng nhập
// router.get('/', auth, async (req, res) => {
//     try {
//         // Lấy thông tin người dùng từ cơ sở dữ liệu dựa vào ID trong token
//         const user = await User.findById(req.user.id).select('-password'); // Loại bỏ trường password
//         res.json(user); // Trả về thông tin người dùng dưới dạng JSON
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// router.post(
//     '/',
//     [
//       check('email', 'Please include a valid email').isEmail(),
//       check('password', 'Password is required').exists()
//     ],
//     async (req, res) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
  
//       const { email, password } = req.body;
  
//       try {
//         // Kiểm tra xem người dùng có tồn tại không
//         let user = await User.findOne({ email });
//         if (!user) {
//           return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
//         }
  
//         // So sánh mật khẩu
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//           return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
//         }
  
//         // Tạo JWT payload
//         const payload = {
//           user: {
//             id: user.id
//           }
//         };
  
//         // Ký JWT và gửi về client
//         jwt.sign(
//           payload,
//           config.get('jwtSecret'), // Lấy secret từ file cấu hình
//           { expiresIn: 36000 }, // Thời gian hết hạn token
//           (err, token) => {
//             if (err) throw err;
//             res.json({ token }); // Trả về token cho client
//           }
//         );
//       } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//       }
//     }
//   );

// module.exports = router;




const router = require("express").Router();
const { User } = require("../../models/User");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: "logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
