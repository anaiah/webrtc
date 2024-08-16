// client-side js, loaded by index.html
// run by the browser each time the page is loaded

////let Peer = window.Peer;

let messagesEl = document.querySelector('.messages');
let peerIdEl = document.querySelector('#connect-to-peer');
let videoEl = document.querySelector('.remote-video');

let logMessage = (message) => {
  let newMessage = document.createElement('div');
  newMessage.innerText = message;
  messagesEl.appendChild(newMessage);
};

let renderVideo = (stream) => {
  videoEl.srcObject = stream;
};

// Register with the peer server
var peer = new Peer(generateRandomDigits(5),{
  config: {'iceServers': [ {url:'stun:stun.iptel.org'}]} /* Sample servers, please use appropriate ones */
  });
  
  console.log(peer)
peer.on('open', (id) => {
  logMessage('PEER ID: ' + id);
});
peer.on('error', (error) => {
  console.error(error);
});

// Handle incoming data connection from remote peer
peer.on('connection', (conn) => {
  logMessage('incoming peer connection makikiraan po!');
  console.log(conn)
  conn.on('data', (data) => {
    console.log('on data')
    logMessage(`received: ${data}`);
  });
  conn.on('open', () => {
    conn.send('hello! main peer');
  });
});

// Handle incoming voice/video connection //DIALER
peer.on('call', (call) => {
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then((stream) => {
      call.answer(stream); // Answer the call with an A/V stream.
      call.on('stream', renderVideo);
    })
    .catch((err) => {
      console.error('Failed to get local stream', err);
    });
});

// Initiate outgoing connection //DIALLER
let connectToPeer = () => {
  let peerId = peerIdEl.value;
  logMessage(`Connecting to ${peerId}...`);
  
  let conn = peer.connect(peerId);
  conn.on('data', (data) => {
    logMessage(`received: ${data}`);
  });
  conn.on('open', () => {

    fa
    conn.send('hi! 2nd peer');
  });

  ///navigator.mediaDevices.

  
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then((stream) => {
      let call = peer.call(peerId, stream);
      call.on('stream', renderVideo);
    })
    .catch((err) => {
      logMessage('Failed to get local stream', err);
    });
};


////window.connectToPeer = connectToPeer;