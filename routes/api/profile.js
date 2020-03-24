const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get logged users profile
// @access  PRIVATE

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);
        
        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        
        res.json(profile)
    
    } catch(err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/profile/
// @desc    Create logged users profile
// @access  PRIVATE

router.post('/', [ auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body

        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;
        // Build skills arr
        if(skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Build social object
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if(profile) {
                // Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profileFields},
                    { new: true }
                );
    
                return res.json(profile);
            }
            // Create
            profile = new Profile(profileFields);
            await profile.save();
            return res.json(profile);
            
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server eror');
        }


    }
);

// @route   GET api/profile/
// @desc    Get all profiles
// @access  PUBLIC


router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);

    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})

// @route   GET api/profile/user/:id
// @desc    Get profile by user id
// @access  PUBLIC

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(profile) {
            return res.json(profile);
        }
        return res.status(400).json({ msg: 'Profile not found' });
        
    } catch(err) {
        console.error(err);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/profile/
// @desc    Delete users profile
// @access  PRIVATE

router.delete('/', auth, async (req, res) => {
    try {
        // @todo remove users posts

        // Remove profile
        await Profile.findOneAndDelete({ user: req.user.id });
        await User.findOneAndDelete({ _id: req.user.id });
        res.json({ msg: 'User deleted' });
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/profile/experience
// @desc    Add user experience
// @access  PRIVATE

router.put('/experience', [
    auth,
    [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty(),
    ] 
], async (req, res) => {    
    errors = validationResult(req);
    if(!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Find and remove experience by id
// @access  PRIVATE

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();

        return res.json(profile);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error')
    }
});


// @route   PUT api/profile/education
// @desc    Add user education
// @access  PRIVATE

router.put('/education', [
    auth,
    [
        check('school', 'School is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('fieldofstudy', 'Fieldofstudy is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty(),
    ] 
], async (req, res) => {    
    errors = validationResult(req);
    if(!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdc = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdc);
        await profile.save();
        res.json(profile);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/profile/education/:edc_id
// @desc    Find and remove education by id
// @access  PRIVATE

router.delete('/education/:edc_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edc_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();

        return res.json(profile);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error')
    }
});





module.exports = router;