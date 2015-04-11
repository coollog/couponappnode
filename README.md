# couponappnode

## Setup

Install the necessary packages:

`npm install --save express mongodb jade socket.io mocha`


Make sure to have a `config.js` with the following:

```
module.exports = {
  httpport: [port for http server],
  ioport: [port for socket.io],
  mongouri: [mongodb uri for database],
  collections: [
    'customers',
    'businesses',
    'deals'
  ]
}
```

## Running

Run the server: `node index`