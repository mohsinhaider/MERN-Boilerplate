let mongoose = require('mongoose');
let express = require('express');
let bodyParser = require("body-parser");
let logger = require('morgan');
let Message = require('./message');
let config = require('./config');

let app = express();
let router = express.Router();
const API_PORT = 3005;

var cors = require('cors');

app.use(cors());

//

// Connecting to the database
mongoose.connect(config.mongoUrl, { useNewUrlParser: true });

let db = mongoose.connection;
db.once("open", () => { console.log("Connected to Mongo!"); });
db.on("error", console.error.bind(console, "MongoDB connection error:"));


// Setting up middleware and request handling basics
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// Basic route controller

router.get('/message', (req, res) => {
    Message.find({}, (err, messages) => {
        if (err) {
            res.send(err);
        }
        return res.json({ success: true, messages: messages });
    })
});

router.get('/message/:id', (req, res) => {
    Message.findOne({ id: req.params.id }, (err, message) => {
        if (err) {
            res.send(err);
        }
        return res.json({ success: true, message: message });
    })
})

router.post('/sendmessage', (req, res) => {
    let newMessage = new Message();

    newMessage.id = req.body.id;
    newMessage.message = req.body.message;

    newMessage.save(err => {
        if (err) {
            res.send(err);
        }
        res.json({ status: "Message created successfully!" });
    })
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
