const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());
const mongoose = require('mongoose');
const User = require('./models/User');
const mongoURL = 'mongodb+srv://giahuy:DOsQO5aRdx0KvXQi@cluster0.zlwag.mongodb.net/'; 

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

// API để lấy dữ liệu từ MongoDB
app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find(); // Lấy tất cả documents trong collection 'user'
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

// // GET: Lấy danh sách người dùng
// app.get('/api/users', (req, res) => {
//   res.json({ users : ["huy", "userTwo", "userThree"] });
// });

// // POST: Thêm người dùng mới
// app.post('/api/users', (req, res) => {
//   const newUser = req.body.name;
//   if (newUser) {
//     users.push(newUser);
//     res.status(201).json({ message: 'User added successfully', users: users });
//   } else {
//     res.status(400).json({ message: 'Name is required' });
//   }
// });

// // PUT: Cập nhật người dùng
// app.put('/api/users/:index', (req, res) => {
//   const userIndex = req.params.index;
//   const newName = req.body.name;
//   if (users[userIndex] && newName) {
//     users[userIndex] = newName;
//     res.json({ message: 'User updated successfully', users: users });
//   } else {
//     res.status(400).json({ message: 'Invalid user index or name' });
//   }
// });

// // DELETE: Xóa người dùng
// app.delete('/api/users/:index', (req, res) => {
//   const userIndex = req.params.index;
//   if (users[userIndex]) {
//     users.splice(userIndex, 1);
//     res.json({ message: 'User deleted successfully', users: users });
//   } else {
//     res.status(400).json({ message: 'Invalid user index' });
//   }
// });

// // Khởi động server
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });