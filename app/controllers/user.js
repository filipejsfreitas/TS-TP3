var User = require('../models/user')

// Devolve a lista de alunos
module.exports.list = () => {
    return User
        .find()
        .exec()
}

module.exports.get = mail => {
    return User
        .findOne({mail: mail})
        .exec()
}

module.exports.insert = u => {
    var newUser = new User(u)
    return newUser.save()
}

