const url = "mongodb://sachinjain:sachinjain13@ds119422.mlab.com:19422/moviecollection";
module.exports = (Mongoose, callback) => {
    Mongoose.connect(url, { useNewUrlParser: true }).then(() => {
        console.log("mongoDb Connected");
        callback();
    }).
        catch((err) => {
            console.log(err);
        })
}