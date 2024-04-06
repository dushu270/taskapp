const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    console.log('Received webhook data:', req.body);
    // Process the webhook data here
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
