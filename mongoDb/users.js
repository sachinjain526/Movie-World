
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    _id: String,
    accesstoken: String,
    displayName: String,
    email: String, // pull the first email
    photoUrl: String, // pull the first emailtitle:  String,
    registeredDate: Date,
    userCollection: Schema.Types.Mixed
});

UserSchema.statics.findOrCreate = function findOneOrCreate(id, data, callback) {
    const self = this
    self.findById(id, (err, result) => {
        console.log(result);
        return result ? callback(err, result) : self.create(data, (err, result) => { return callback(err, result) })
    })
}
module.exports = mongoose.model('Users', UserSchema);