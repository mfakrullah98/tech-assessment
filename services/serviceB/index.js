const express = require('express');
const { connect } = require('../../rabbitmq');

const app = express();
const port = 3002;

(async () => {
    const { connection, channel } = await connect();
    const exchange = 'user_events';

    channel.assertExchange(exchange, 'topic', { durable: true });
    const queue = await channel.assertQueue('', { exclusive: true });

    channel.bindQueue(queue.queue, exchange, 'user.profile.updated');

    channel.consume(queue.queue, (msg) => {
        const userData = JSON.parse(msg.content.toString());
        console.log('Received new user:', userData);
    }, { noAck: true });
})();

app.listen(port, () => {
    console.log(`Service B listening on port ${port}`);
});
