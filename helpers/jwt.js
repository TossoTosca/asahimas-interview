const jwt = require('jsonwebtoken');

const genPayload = (payload) => {
    return jwt.sign(payload, "secretCode")
}

const verifyToken = (token) => {
    return jwt.verify(token, "secretCode")
}

module.exports = {
    genPayload,
    verifyToken
}