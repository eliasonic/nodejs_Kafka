const { Kafka } = require('kafkajs')

const brokers = ['localhost:9092']

const kafka = new Kafka({
    clientId: 'notifications-service',
    brokers
})

const consumer = kafka.consumer({
    groupId: 'notifications-service'
})

const messageCreatedHandler = (data) => {
    console.log('Got a new message', JSON.stringify(data, null, 2))
}

const topicHandler = {
    'message-created': messageCreatedHandler
}

const topics = ['message-created', 'message-updated', 'message-deleted']

exports.connectConsumer = async () => {
    await consumer.connect()
    console.log('Consumer connected')

    for (let i = 0; i < topics.length; i++) {
        await consumer.subscribe({
            topic: topics[i],
            fromBeginning: true
        })
    }

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (!message || !message.value) {
                return
            }
    
            const data = JSON.parse(message.value.toString())

            const handler = topicHandler[topic]
            handler(data)
        }
    })
}

exports.disconnectConsumer = async () => {
    await consumer.disconnect()
    console.log('Consumer disconnected')
}