const jwt = require('jsonwebtoken');
const config = require('config');

const checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (req.session.token) {
        token = req.session.token;
    } else if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        console.log(token)
    } 

    if (token) {
        jwt.verify(token, config.get('jwtKey'), (err, decoded) => {
            if(err) {
                console.log(err)
                return res.json({
                    success: false,
                    message: 'Token is not valid',
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        })
    }
}

module.exports = {
    checkToken: checkToken
}