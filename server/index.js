const express = require('express');
const app = express();
const cors = require('cors');
const WordFilter = require('bad-words');
const rateLimit = require('express-rate-limit');

//setup
require('dotenv').config({ path: __dirname + '/.env' });
const DB_URL = process.env.MONGO_URI;
const wordFilter = new WordFilter();
const db = require('monk')(DB_URL);
const secrets = db.get('secrets');
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());

//methods
const isValid = (dataObj) => {
    //* verifies that all fields contain data
    let isValid = true;
    for (const key in dataObj) {
        const data = dataObj[key].toString().trim();
        if (data.length < 1) {
            isValid = false;
        }
    }
    return isValid
}

//paths
app.get('', (req, res) => res.send('Server is active'));
app.post('/secrets', rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 1
}), (req, res) => {
    if (isValid(req.body)) {
        const secretData = {
            name: wordFilter.clean(req.body.name),
            secret: wordFilter.clean(req.body.secret)
        }
        secrets
            .insert(secretData)
            .then(newSecret => {
                res.status(200).json(newSecret)
            })
    } else res.status(401).json({ msg: 'data invalid' })
})
app.get('/secrets', (req, res) => {
    secrets
        .find()
        .then(secrets => res.status(200).json(secrets))
        .catch(err => res.status(400).json({ msg: "Secrets couldn't be retrieved from DB" }))
})

app.listen(port, () => console.log('listening on port ' + port));