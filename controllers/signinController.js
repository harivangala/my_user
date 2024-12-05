const {User} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//User Signin
exports.signin = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({success: false, message: 'Email or Password missing'});
    }
    try {
        const user = await User.findOne({where: {email}});
        if(!user) {
            console.log('User not found: ', email);
            return res.status(404).json({success: false, message: 'Invalid email: User not exists with the provided email'});
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched) {
            console.log('Incorrect Password');
            return res.status(401).json({success: false, message: 'Incorrect Password'});
        }
        const payload = {name: user.name, email: user.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
        res.status(200).json({success: true, message: `${user.name}: Login successful`, token});
    } catch(error) {
        console.log(error);
        return res.status(400).json({success: false, message: error.message});
    }
}

