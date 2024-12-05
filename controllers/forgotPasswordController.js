const { where } = require('sequelize');
const {User} = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {Op} = require('sequelize');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

exports.forgotPassword = async (req, res) => {
    const {email} = req.body;
    if(!email){
        console.log("line-18: email not provided");
        return res.status(400).json({success: false, message: 'Email not provided'});
    }
    try {
        const user = await User.findOne({where: {email}});
        if(!user) {
            console.log("line-24: User not found");
            return res.status(404).json({success: false, message: 'User not found with the entered email, Please enter a valid email'});
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000;
        console.log("line-29: TOKEN GENERATION");
        await user.update({resetToken: resetToken, resetTokenExpiry: tokenExpiry});
        console.log("line-31: TOKEN updated");
        
        const resetURL = `${req.protocol}://${req.get('host')}/app/token-verify/${resetToken}`;
        const options = {
            to: user.email,
            from: 'rajugoudvasu@gmail.com',
            subject: 'Reset your password',
            text: 'To reset your password click the below link',
            html: `<a>${resetURL}</a>`
        }
        console.log("line-41: Sending email");
        await transporter.sendMail(options);
        console.log("line-43: Email sent");
        res.status(200).json({success: true, message: 'A reset link sent to the registered email'});
    } catch(error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: error.message});
    }
}

exports.tokenVerify = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    if(!token) {
        return res.status(400).json({success: false, message: 'To reset password Token required'});
    }
    try{
        const user = await User.findOne({where: {resetToken: token, resetTokenExpiry: {[Op.gt]: Date.now()}}});
        if(!user) {
            return res.status(404).json({success: false, message: 'Invalid token or Token expired'});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        user.update({
            password: hashPassword,
            resetToken: null,
            resetTokenExpiry: null
        });
        res.status(200).json({success: true, message: 'Your password successfuly resetted, You can log in now'});
    } catch(error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: error.message});
    }
}