const express = require('express')
const { connectProducer, sendMessage, disconnectProducer } = require('./kafka/producer')

const PORT = 9000

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).json('Welcome to Messages Service!')
})

app.post('/notifications', async (req, res) => {
    try {
        await sendMessage('message-created', JSON.stringify(req.body))
        return res.status(200).json('Message sent to notification service')
    } catch (err) {
        return res.status(500).json(err)
    }
})

const gracefulShutdown = async () => {
    console.log('Shutting down...')
    await disconnectProducer()

    process.exit(0)
}

const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT']   // kill signals

for (const signal of signals) {
    process.on(signal, () => {
        gracefulShutdown()
    })
}

app.listen(PORT, () => {
    console.log(`Messages service is running on ${PORT}`)
    
    connectProducer()
})