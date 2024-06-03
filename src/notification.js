const express = require('express')
const { connectConsumer } = require('./kafka/consumer')

const PORT = 8000

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).json('Welcome to Notifications Service!')
})

app.listen(PORT, () => {
    console.log(`Notifications service is running on ${PORT}`)

    connectConsumer()
})