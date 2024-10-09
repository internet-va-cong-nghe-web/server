const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('config');
const mongoURL = config.get('mongoURL'); 
const userRoutes = require('./routes/api/users'); const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
app.use(express.json());//body parser

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// app.use('/api/users', userRoutes);
app.get('/api/users', async(req,res) =>{
  try{
    // const users = await User.find({});
    // console.log(users);
    // res.json(users);
    const users = await User.find();
      res.json(users);
  }catch(err){
    res.status(500).json('server error');
  }});

app.post(
    '/post',
    // [
    //   check('name', 'Name is required').not().isEmpty(),
    //   check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    //   check('email', 'Please include a valid email').isEmail()
    // ],
    async (req, res) => {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.status(400).json({ errors: errors.array() });
      // }
      // Destructure name, email, password from req.body
      const { name, email, password } = req.body;
  
      try {
       
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
  
        // // Get user's gravatar
        // const avatar = gravatar.url(email, {
        //   s: '200', // Size
        //   r: 'pg',  // Rating
        //   d: 'mm'   // Default image
        // });
  
        // Create new instance of user
        user = new User({
          name,
          email,
          password
        });
  
        // Encrypt password using bcrypt
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);
  
        // Save the user to the database
        await user.save();
  
        // Return JWT for authentication
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 36000 }, // Token expires in 36000 seconds.
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error post');
      }
    }
  );

app.listen(PORT , () => {
  console.log(`Server is running on port ${PORT}`);
});