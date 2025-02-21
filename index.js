const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = 5000 || process.env.PORT
require('dotenv').config()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xk6aw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function run () {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect()
    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 })
    // console.log(
    //   'Pinged your deployment. You successfully connected to MongoDB!'
    // )

    //Create a user collection
    const userCollection = client.db('taskManagement').collection('users')
    //Create a task collection
    const taskCollection = client.db('taskManagement').collection('tasks')

    app.post('/users', async (req, res) => {
      const newUser = req.body
      const result = await userCollection.insertOne(newUser)
      res.send(result)
    })

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find({})
      const users = await cursor.toArray()
      res.send(users)
    })

    app.post('/tasks', async (req, res) => {
      const newTask = req.body
      const result = await taskCollection.insertOne(newTask)
      res.send(result)
    })

    app.get('/tasks', async (req, res) => {
      const cursor = taskCollection.find({})
      const tasks = await cursor.toArray()
      res.send(tasks)
    })


    app.get('/tasks/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const task = await taskCollection.find(query).toArray()
      res.send(task)
    })

    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const updatedTask = req.body
      const updateDoc = {
        $set: {
          title: updatedTask.title,
          category: updatedTask.category,
          description: updatedTask.description,
        }
      }
      const result = await taskCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    app.put('/tasks/moved/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const category = req.body.category
      const updateDoc = {
        $set: {
          category: category
        }
      }
        const result = await taskCollection.updateOne(query, updateDoc)
        res.send(result)
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close()
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Running Task Management App!')
})

app.listen(port, () => {
  console.log(`Task Management App is running on port ${port}`)
})
