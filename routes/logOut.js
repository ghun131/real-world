const express = require('express');
const router = express.Router();
const middleware = require('../middleware');

router.post('/', middleware.checkToken, (req, res) => {
    const user = req.body.user;
    const token = req.body.token;

    req.session.user = user;
    req.session.token = token;
    res.end();
})

module.exports = router;