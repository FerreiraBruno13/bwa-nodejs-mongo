# NodeJS MongoDB Broken Web Application

This repos is meant to demonstrate a broken API with a vulnerable route.

## Installation
```sh
npm i
```

## Run

### [Docker Compose](https://docs.docker.com/compose/install)
```sh
docker-compose up -d
```

The API will be listening on http://localhost:3000

## Usage

### Input users

This MongoDB database starts empty. You can input users in the `/users/new` route. Every user must have a `username` and `password`. You are free to add more complexity on the routes locally and play with other values.

---

### MongoDB Injection

You can inject a MongoDB operator on the `username` and `password` payloads, just like this:

```json
{
  "username": { "$gt": "" },
  "password": { "$gt": "" }
}
```

If you send this payload on the `/users/broken` route, you'll see that all the data from every user will match this query.