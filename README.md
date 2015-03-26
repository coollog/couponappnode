# couponappnode

Make sure to have a config.js in server/ with the following:

```
module.exports = {
  port: [port for socket.io],
  mongouri: [mongodb uri for database],
  collections: [array of collections to use in the mongodb]
}
```
