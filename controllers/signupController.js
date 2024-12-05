const bcrypt = require('bcrypt');
const {User} = require('../models');

exports.signup = async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({success: true, message: 'Require all fields'});
    }
    try {
        const isUserPresent = await User.findOne({where: {email}});
        console.log(isUserPresent);
        if(isUserPresent){
            return res.status(400).json({success: false, message: 'User already exists'});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword);
        const newUser = await User.create({name: name, email: email, password: hashPassword});
        res.status(201).json({success: true, message: `User created: ${newUser.name}`});
        console.log(newUser);
    } catch(error) {
        console.log(error);
        return res.status(400).json({success: false, message: error.message});
    }
}