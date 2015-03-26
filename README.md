# couponappnode

## Setup

Install the necessary packages:

`npm install --save express mongodb jade socket.io`


Make sure to have a `config.js` with the following:

```
module.exports = {
  httpport: [port for http server],
  ioport: [port for socket.io],
  mongouri: [mongodb uri for database],
  collections: [array of collections to use in the mongodb]
}
```

## Running

Run the server: `node index`

Right now, it's just a simple login/register thing. Connect to http with `localhost:8888`.