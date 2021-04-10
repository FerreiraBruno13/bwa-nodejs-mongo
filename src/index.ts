import dotenv from "dotenv"
import express from "express"
import { MongoClient } from "mongodb"
import { json } from "body-parser"

dotenv.config()

async function run() {
  const mongoUrl = String(process.env.MONGO_URL)
  const port = process.env.PORT || 3000

  const app = express();

  app.use(json());

  const client = new MongoClient(mongoUrl, {
    useUnifiedTopology: true
  })

  await client.connect()

  const database = client.db('sample_api');
  const users = database.collection('users');

  app.get("/", async (request, response) => {
    // Query for a movie that has the title 'Back to the Future'
    const query = { username: 'root' };
    const user = await users.findOne(query);

    response.json(user).end()
  })

  // List users
  app.get("/users", async (request, response) => {
    const usersList = await users.find().toArray()

    response.json(usersList).end()
  })

  /**
   * Example of bad filtering and queue construction
   */
  app.post("/users/broken", async ({ body: { username, password } }, response) => {
    const user = { username, password }
    const userFound = await users.find(user).toArray()

    // Remove _id from objects
    const result = userFound.map(entry => {
      const { _id, ...rest } = entry

      return { ...rest }
    })

    response.json({ result }).end()
  })

  app.post("/users/login", async ({ body: { username, password } }, response) => {
    const user = { username, password }

    const userFound = await users.findOne(user)

    if (!userFound) {
      return response.send("Invalid username or password").end()
    }

    response.send(`${username} has logged in! :)`)
  })

  app.post("/users/new", async ({ body: { username, password } }, response) => {
    const user = { username, password }

    const userFound = await users.findOne(user)

    if (!userFound) {
      const { result, ops } = await users.insertOne(user)

      if (!result.ok) {
        return response.status(500).send("Error trying to add user :(").end()
      }

      return response.json(ops).end()
    }

    response.json(userFound).end()
  })

  app.listen(port, () => {
    console.info(`Server listening on port ${port}`)
  })
}

run().catch(console.dir)