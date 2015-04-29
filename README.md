# couponappnode

## Setup

Install the necessary packages:

`npm install --save express mongodb jade socket.io socket.io-client colors stripe`


Make sure to have a `config.js` with the following (set your own values in <>):

```
module.exports = {
  httpport: <port for http server>,
  ioport: <port for socket.io>,
  mongouri: <mongodb uri for database>,
  mongouritest: <mongodb uri for testing database>,
  collections: [
    'customers',
    'businesses',
    'deals'
  ],
  stripekey: <stripe api key secret>
}
```

## Running

Run the server: `node index`