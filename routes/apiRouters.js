const User = require('../mongoDb/users');

module.exports = (app) => {
    /* all users api */
    app.get('/api/current_user', (req, res) => {// it will current user detail on screan
        if (req.user) {
            res.json(req.user);
        } else {
            res.json(null);
        }

        console.log("current user");
    });

    app.get('/api/users', function (req, res) {
        User.find({}).then(results => {
            res.json(results)
            console.log(results);
        }).catch(error => {
            res.send(error);
        });
    });
    // delete api
    app.delete('/api/user/:userId', (req, res) => {
        User.findOneAndRemove({ _id: req.params.userId }).then(user => {
            res.json(user);
        }).catch(error => {
            res.send(error);
        });
    });
    /* all collection api */
    app.get('/api/usercollection', function (req, res) {
        const userId = req.headers.userid;
        console.log(userId);

        User.findById(userId).then(results => {
            if (results) {
                res.json(results.userCollection);
            }
        }).catch(error => {
            res.send(error);
        });
    });
    app.get('/api/usercollection/:collectionName', function (req, res) {
        const userId = req.headers.userid;
        console.log(userId);

        const findDataObj = {};
        findDataObj['userCollection.' + req.params.collectionName.toLowerCase()] = req.params.collectionName.toLowerCase();

        User.findById(userId, findDataObj).then(results => {
            if (results) {
                const retObj = results.userCollection[req.params.collectionName.toLowerCase()];
                res.json(retObj);
            }
        }).catch(error => {
            res.send(error);
        });
    });
    app.get('/api/collection/:collectionName/:movieId', function (req, res) {
        const userId = req.headers.userid;
        console.log(userId);

        const collectionName = req.params.collectionName.toLowerCase();
        const findDataObj = {};
        findDataObj['userCollection.' + collectionName] = collectionName;

        User.findById(userId, findDataObj).then(results => {
            if (results) {
                results.userCollection[collectionName].filter(function (el) {
                    if (el.id == req.params.movieId) {
                        res.json(el);
                        return;
                    }
                })
            }
        }).catch(error => {
            console.log(error);
            res.send(error);
        });
    });
    app.post('/api/collection/:collectionName', (req, res) => {
        const userId = req.headers.userid;
        console.log(userId);
        const saveDataObj = {};
        saveDataObj['userCollection.' + req.params.collectionName.toLowerCase()] = req.body;
        console.log(saveDataObj);
        User.findOneAndUpdate({ _id: userId }, { $push: saveDataObj }, { new: true }).then(user => {
            res.json(req.body);
        }).catch(error => {
            res.send(error);
        });
    });

    app.delete('/api/collection/:collectionName/:movieId', (req, res) => {
        const userId = req.headers.userid;
        console.log(userId);
        const saveDataObj = {};
        saveDataObj['userCollection.' + req.params.collectionName.toLowerCase()] = { "id": req.params.movieId };
        User.findOneAndUpdate({ _id: userId }, { $pull: saveDataObj }, { new: true }).then(user => {
            res.json(user);
        }).catch(error => {
            res.send(error);
        });
    });
}