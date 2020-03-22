const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require('express-validator')

// User model
const User = require('../../models/User');

// @route   GET api/users
// @desc    Register User
// @access  PUBLIC

router.post('/', [
    // Validate user input
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', "Please enter a password with 6 or more characters").isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // See if user exists
    try {
        const user = await User.findOne({ email: email }) // or User.findOne({ email })
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        // Get user gravatar
        const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })
        // Create user
        const newUser = new User({
            name,
            email,
            avatar,
            password
        });
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        // Return jsonwebtoken
        const payload = {
            user: {
                id: newUser.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000}, (err, token) => {
            if(err) throw err;
            res.json({ token });

        });
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

    
});
module.exports = router;