const { Kafka } = require('kafkajs')

const brokers = ['localhost:9092']

const kafka = new Kafka({
    clientId: 'messages-service',
    brokers
})

const producer = kafka.producer()

exports.connectProducer = async () => {
    await producer.connect()
    console.log('Producer connected')
}

exports.disconnectProducer = async () => {
    await producer.disconnect()
    console.log('Producer disconnected')
}

exports.sendMessage = async (topic, message) => {
    return producer.send({
        topic,
        messages: [{ value: message }]
    })
}