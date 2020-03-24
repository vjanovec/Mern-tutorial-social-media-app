const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route   POST api/posts/
// @desc    Create post
// @access  PRIVATE

router.post('/', [
    auth,
    [
        check('text', "Text is required").not().isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
    
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: user.id,
        });
        await newPost.save();
        console.log(newPost);
        res.json(newPost);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/posts/
// @desc    Get all posts
// @access  PRIVATE

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error')
    }
});

// @route   GET api/posts/post/:post_id
// @desc    Get post by id
// @access  PRIVATE

router.get('/:post_id', auth, async (req, res) => {
    try {  
        const post = await Post.findById(req.params.post_id); 
        if(post) {
            return res.json(post);
        }
        res.status(400).json({ msg: 'Post not found' })

    } catch(err) {
        console.error(err);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server error')
    }
})

// @route   DELETE api/posts/post/:post_id
// @desc    Delete post by id
// @access  PRIVATE

router.delete('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }
        if(post.user.toString() === req.user.id) {
            post.remove();
            return res.json({ msg: 'Post deleted' });
        }
        res.status(400).json({ msg: 'This is not your post' })

    } catch(err) {
        console.error(err);
        res.status(500).send('Server error')
    }
});


// @route   GET api/posts/
// @desc    Get users posts
// @access  PRIVATE

router.get('/user-posts/:user_id', auth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.user_id });
        res.json(posts);

    } catch(err) {
        console.error(err);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server error')
    }
});

// @route   PUT api/posts/like/:post_id
// @desc    Like post 
// @access  PRIVATE

router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            res.status(400).json({ msg: 'Post not found'});
        }
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked'});
        } 
        
        post.likes.unshift({ user: req.user.id });
        await post.save();
        return res.json(post.likes);
        
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// @route   PUT api/posts/unlike/:post_id
// @desc    Remove like from post 
// @access  PRIVATE

router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            res.status(400).json({ msg: 'Post not found'});
        }
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            
            return res.status(400).json({ msg: 'Post has not been liked yet'});
        } 
        
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        return res.json(post.likes);
        
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route   POST api/posts/comment/:post_id
// @desc    Add comment
// @access  PRIVATE

router.post('/comment/:post_id', [auth, 
    [
        check('text', "Text is required").not().isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const post = await Post.findById(req.params.post_id);
        const user = await User.findById(req.user.id).select('-password');

        if(!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }

        const newComment = { 
            user: req.user.id,
            text: req.body.text, 
            name: user.name,
            avatar: user.avatar,
        }
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);

    } catch(err) {
        console.error(err);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
});

router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }
        
        // Find comment
        const comment = post.comments.filter(comment => comment.id.toString() === req.params.comment_id)[0]; 
        console.log(comment);
        // Check comment
        if(!comment) {
            return res.status(400).json({ msg: 'Comment not found' });
        }
        // Check comment owner
        console.log(comment.user.toString(), typeof(comment.user.toString()))
        console.log(req.user.id, typeof(req.user.id))
        if(!(comment.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'This is not your post' })
        }
        const remoteIndex = post.comments.indexOf(comment);
        post.comments.splice(remoteIndex, 1);
        await post.save();
        res.json(post.comments);

    } catch(err) {
        console.error(err);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;