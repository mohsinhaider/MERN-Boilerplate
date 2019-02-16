let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const Message = new Schema(
    {
        id: Number,
        message: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", Message);