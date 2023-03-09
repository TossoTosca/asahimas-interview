const bcrypt = require('bcryptjs');

const hash = (password) => {
    return bcrypt.hashSync(password, 8)
}
const compare = (password, hashPass) => {
    return bcrypt.compareSync(password, hashPass)
}

module.exports = {
    hash, compare
}