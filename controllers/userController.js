var User = require("../models/user");
var CryptoJS = require("crypto-js");
const CRYPTO_KEY = "auth-pass";
const fs = require('fs');

module.exports = {
    signup: signup,
    login: login,
    getUserById: getUserById,
    getList: getList,
    updateUser: updateUser,
    removeUserById: removeUserById,
};

function signup(req, res) {
    if (!req.body.email) {
        res.json({ success: false, msg: "Please pass email." });
    } else {
        User.findOne({ email: req.body.email }, function(err, data) {
            if (err) {
                res.json({ success: false, msg: "Something went wrong." });
            } else if (data) {
                res.json({ success: false, msg: "Your Email Id Already Exists." });
            } else {
                if (req.body.fileSource && req.body.fileSource) {
                    let base64Image = req.body.fileSource.split(';base64,').pop();
                    const data = fs.writeFileSync('./uploads/' + req.body.file, base64Image, { encoding: 'base64' });
                    console.log(data)
                }
                var newUser = new User(req.body);
                newUser.save(function(err) {
                    if (err) {
                        return res.json({
                            success: false,
                            msg: "Username or email already exists.",
                        });
                    } else {
                        res.json({ success: true, msg: "Successful created new user." });
                    }
                });
            }
        });
    }
}

function updateUser(req, res) {
    if (req.body && req.body._id) {
        let id = req.body._id;
        User.findOne({ email: req.body.email, _id: { $ne: id } }, function(err, data) {
            if (err) {
                res.json({ success: false, msg: "Something went wrong." });
            } else if (data) {
                res.json({ success: false, msg: "Your Email Id Already Exists." });
            } else {
                if (req.body.fileSource && req.body.fileSource) {
                    let base64Image = req.body.fileSource.split(';base64,').pop();
                    const data = fs.writeFileSync('./uploads/' + req.body.file, base64Image, { encoding: 'base64' });
                    console.log(data);
                }
                User.findOneAndUpdate({ _id: id }, { $set: req.body }, { useFindAndModify: false }, function(
                    err,
                    userData
                ) {
                    if (err) {
                        console.log(err);
                        return res.json({ success: false, msg: "User updation failed." });
                    } else {
                        return res.json({
                            success: true,
                            data: userData,
                            msg: "Successful updated user.",
                        });
                    }
                });
            }
        });
    } else {
        res.json({ success: false, msg: "User Id Not Found." });
    }
}

function login(req, res) {
    User.findOne({
            username: req.body.userName,
            password: req.body.password,
        },
        function(err, user) {
            if (err) throw err;

            if (!user) {
                res.status(401).send({
                    success: false,
                    msg: "Authentication failed. User not found.",
                });
            } else if (!user.active) {
                res.status(401).send({
                    success: false,
                    msg: "Account deactivated.Please contact admin for activation",
                });
            } else {
                let userData = {
                    username: user.username,
                    email: user.email,
                    dob: user.dob,
                    mobile: user.mobile,
                    id: user._id,
                };
                res.json({
                    success: true,
                    data: userData,
                    msg: "Login successfully.",
                });
            }
        }
    );
}

function getUserById(req, res) {
    if (req.params && req.params.id) {
        let id = req.params.id;
        User.findOne({ _id: id }, function(err, result) {
            if (err) {
                return res.json({ success: false, msg: "Problem in fetching User." });
            } else {
                res.json({
                    success: true,
                    data: result,
                    msg: "Successful user fetched.",
                });
            }
        });
    } else {
        res.json({ success: false, msg: "User Id Not Found." });
    }
}

function removeUserById(req, res) {
    if (req.params && req.params.id) {
        let id = req.params.id;
        User.findOneAndRemove({ _id: id }, function(err, result) {
            if (err) {
                return res.json({ success: false, msg: "User Not Deleted." });
            } else {
                res.json({
                    success: true,
                    data: result,
                    msg: "User Deleted Successfully.",
                });
            }
        });
    } else {
        res.json({ success: false, msg: "User Id Not Found." });
    }
}

function getList(req, res) {
    User.find({}, function(err, userList) {
        if (err) {
            return res.json({ status: false, msg: "Problem in fetching User List." });
        } else {
            res.json({
                success: true,
                data: userList,
                msg: "Successful user fetched.",
            });
        }
    });
}

function decrypt(value) {
    let bytes = CryptoJS.AES.decrypt(value, CRYPTO_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}