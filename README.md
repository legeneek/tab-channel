# tab-channel
send message to other tab in the same origin. use BroadcastChannel default, use storage event as fallback

## install
```
npm i tab-channel
```

## useage
```javascript
import Channel from 'tab-channel'

// channel name is required
var channel = new Channel('my-channel')

// get channel name
channel.name

// bind message event 
channel.onmessage = function(m) {
  // string msg in data property
  doAnything(m.data)
}

// send message
channel.postMessage('hello world')

// handle error message
channel.onmessageerror = function(e) {
  //e is an Error object
}

// close channel
channel.close()
```
