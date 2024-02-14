const express = require('express');
const { connect } = require('../../rabbitmq');
const path = require('path');
const fs = require('fs');

const app = express();
const userDataFile = path.join(__dirname, 'userData.json');
const port = 3001;

function loadUserData() {
    try {
        const rawData = fs.readFileSync(userDataFile);
        return JSON.parse(rawData);
    } catch (err) {
        console.error('Error loading user data:', err);
        return {};
    }
}


function saveUserData(userId) {
    try {
        const userData = {
            users: [
                {id: 1, name: "John Doe", favoriteGenres: ["pop", "rock"]},
                // Other users ...
                {id: 4, name: "Jill Doe", favoriteGenres: ["pop", "jazz", "hip-hop"]},
                {id: userId, name: "James Doe", favoriteGenres: ["Classic", "Instrument"]}
            ]
        }
        fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));
    } catch (err) {
        console.error('Error saving user data:', err);
    }
}

app.get('/api/v1/users',async(req,res)=>{
    res.send(loadUserData())
})

app.post('/api/v1/users/:id', async (req, res) => {

    const { connection, channel } = await connect();
    const exchange = 'user_events';
    const routingKey = 'user.profile.updated';
    const userEventData = {
        userId: parseInt(req.params.id),
    };

    saveUserData(req.params.id);

    channel.assertExchange(exchange, 'topic', { durable: true });
    console.log(`New user id : ${userEventData}`)
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(userEventData)));

    res.send('Profile created');
});
app.get('/api/v1/users/:id', (req, res) => {
    const userData = loadUserData();
    if (!userData.users) {
        return res.status(404).send('User data not found');
    }
    const user = userData.users.find(user => user.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

app.get('/api/v2/users/:id', (req, res) => {
    const userData = loadUserData();
    if (!userData.users) {
        return res.status(404).send('User data not found');
    }
    const user = userData.users.find(user => user.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

app.listen(port, () => {
    console.log(`Service A listening on port ${port}`)
})

