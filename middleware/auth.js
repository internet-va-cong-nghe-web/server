const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, res, next) {
    // Lấy token từ header (được gửi từ client trong header 'x-auth-token')
    const token = req.header('x-auth-token');
    
    // Nếu không có token, trả về lỗi 401 (Unauthorized)
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify (xác thực) token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // Gán giá trị đã giải mã (decoded) vào req.user để sử dụng trong route tiếp theo
        req.user = decoded.user;
        next(); // Chuyển sang phần tiếp theo của middleware
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};