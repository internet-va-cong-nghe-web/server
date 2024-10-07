const mongoose = require('mongoose');

// Chuỗi kết nối đến MongoDB (đặt URI đúng theo database của bạn)
const mongoURI = 'mongodb+srv://giahuy:user123@cluster0.zlwag.mongodb.net/'; // Thay đổi với URL của bạn

// Kết nối đến MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
  }
};