//Password Change
const {User} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.changePassword = async (req, res) => {
    const {newPassword} = req.body;
    const authHeader = req.headers['authorization'];
    if(!newPassword) {
        return res.status(400).json({success: false, message: 'Please to provide new password'});
    }
    if (!authHeader) {
        return res.status(400).json({ success: false, message: 'Authorization header is missing' });
    }
    const token = authHeader.split(" ")[1];
    if(!token) {
        return res.status(400).json({success: false, message: 'Missing Token'});
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(payload);
        const user = await User.findOne({where: {email: payload.email}});
        if(!user) {
            return res.status(404).json({success: false, message: 'User not found'});
        }
        console.log(user.email);
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({password: newHashedPassword}, {where: {email: user.email}});
        res.status(200).json({success: true, message: 'Password Changed successfuly'});
    } catch(error) {
        console.log(error.message);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
        return res.status(500).json({success: false, message: error.message});
    }  
}