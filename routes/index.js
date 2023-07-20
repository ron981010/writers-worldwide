const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/users', require('./users'));
router.use('/events', require('./events'));

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', function (req, res, next) {
    req.logOut(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


module.exports = router;