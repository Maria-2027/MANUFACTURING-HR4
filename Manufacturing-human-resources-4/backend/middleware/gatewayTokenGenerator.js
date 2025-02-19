const jwt = require('jsonwebtoken')

const generateServiceToken = () => {
    const payload = { service: 'Hr 4' };
    return jwt.sign(payload, process.env.GATEWAY_JWT_SECRET, { expiresIn: '10m' });
};

module.exports = {
    generateServiceToken
}