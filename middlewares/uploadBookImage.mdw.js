const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public/imgs/books");
    },
    filename: function (req, file, cb) {
        req.body.id = Date.now().toString();
        cb(null, req.body.id + '.png')
    }
})

const upload = multer({
    storage,
})

module.exports = upload;