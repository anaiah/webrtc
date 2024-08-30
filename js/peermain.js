// client-side js, loaded by index.html
// run by the browser each time the page is loaded

////let Peer = window.Peer;

let messagesEl = document.querySelector('.messages');
let peerIdEl = document.querySelector('#connect-to-peer');
let videoEl = document.querySelector('.remote-video');
let conn, peer, peerid
let localStream, remoteStream, videoElement

const cam = {
  getParameterByName :(name, url = window.location.href) => {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },

  logMessage : (message) => {
    let newMessage = document.createElement('div');
    newMessage.innerText = message;
    messagesEl.appendChild(newMessage);
  },
  
  renderVideo : (stream) => {
    videoEl.srcObject = stream;
    videoEl.muted = true
  },
  
  playVideoFromCamera : async () => {
    console.log('...playing local')
    try{
        const constraints = {'video': true, 'audio': true};
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement = document.querySelector('#local-video');
        
        videoElement.srcObject = localStream;
        
        videoElement.onloadedmetadata = () => {
          videoElement.muted=true
          videoElement.play();
        };
  

      //auto connect for patient
      if(cam.getParameterByName('id')==="1"){
        ////////////////////////////////////////////
         cam.connectToPeer()
        ///////////////////////////////////////////
      }
      
    } catch(error) {
        console.error('Error opening video camera.', error);
    }
  
  },
  
  //===========start connecting to rtc
  startPeer : async() =>{
    peer = new Peer( peerid,{
      config: {
        iceServers: [
          {
            urls: "stun:stun.relay.metered.ca:80",
          },
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "f096217059fc3f01382d9c82",
            credential: "oB6ICmYPsM7A2zg4",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "f096217059fc3f01382d9c82",
            credential: "oB6ICmYPsM7A2zg4",
          },
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "f096217059fc3f01382d9c82",
            credential: "oB6ICmYPsM7A2zg4",
          },
          {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "f096217059fc3f01382d9c82",
            credential: "oB6ICmYPsM7A2zg4",
          }
        ]
    
      } /* Sample servers, please use appropriate ones */
    });
    
    peer.on('open', (id) => {
      cam.logMessage('PEER ID: ' + id);
      //play local
      
      //////////////////////// patay muna video camera
      cam.playVideoFromCamera()
      //////////////////////////

      
    });
    peer.on('error', (error) => {
      cam.logMessage(error);
    });
    
    // Handle incoming data connection from remote peer
    peer.on('connection', (conn) => {
      
      cam.logMessage('incoming Call...');
    
      conn.on('open', () => {
        conn.send("Doctor Connected!")
        
          conn.on('data', (data) => {
            cam.logMessage(`received: ${data}`);
        
          });
      });
   
    });

    
    
    // Handle incoming voice/video connection //DIALER
    peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((stream) => {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', cam.renderVideo);
        })
        .catch((err) => {
          console.error('Failed to get local stream', err);
        });
    });
    
  },//=======END STARTPEER()

  //==close peear
  closePeer: () => {
    /*
    // manually close the peer connections
    for (let conns in peer.connections) {
      peer.connections[conns].forEach((conn, index, array) => {
        console.log(`closing ${conn.connectionId} peerConnection (${index + 1}/${array.length})`, conn.peerConnection);
      
        conn.peerConnection.close();
      })
    }
      */
    
   // console.log(localStream.getTracks() )
    
    //stop audio/video tracks
    
    localStream.getTracks().forEach((track) => {
        console.log(track)
        if (track.readyState == 'live') {
            track.stop();
            console.log('stopping ',track.id)
        }
    });

    messagesEl.innerHTML=""

    videoElement.srcObject = null
    
    
  },

  // Initiate outgoing connection //DIALLER->patient
  connectToPeer: () => {
    let peerId = peerIdEl.value;
    cam.logMessage(`Connecting to ${peerId}...`);
    
    conn = peer.connect(peerId);

    conn.on('data', (data) => {
      conn.send(`Patient Connected!`);
      cam.logMessage(`received: ${data}`);
    });

    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then((stream) => {
        
      let call = peer.call(peerId, stream);

        call.on('stream', cam.renderVideo);
    })
    .catch((err) => {
        cam.logMessage('Failed to get local stream', err);
    });
      
  },//end function connectopeer()


  getpatienthistory: async(doc_id,caseno)=>{

    console.log('fired ==== getpatienthistory() ')

    //await fetch(`http://192.168.158.221:10000/getpatienthistory/${doc_id}/${caseno}`)
    await fetch(`https://osndp.onrender.com/getpatienthistory/${doc_id}/${caseno}`)
    .then((response) => {  //promise... then
        return response.text();
    })
    .then((text) => {
        document.getElementById('dashboard').innerHTML=""
        let txt =`
        <div class="container-fluid mt-0" id="current_projects"><br><br>
            <br> 
            <strong>Patient Booking</strong>
            <div class="card">
                <div class="card-body">
                    <p id='p-notif' class="mb-0"> </p>
                   <div class='row'>
                        <div id='history'>${text}</div>
                    </div>
                </div>
            </div>
            
            <br>
        </div>`

        document.getElementById('dashboard').innerHTML = txt 
        util.scrollsTo('dashboard')
    })
    .catch((error) => {
        console.error('Error:', error)
    })

},

  //===load first
  init: ()=>{
    //THIS WILL EXECUTE FIRST
    if(cam.getParameterByName('id')==="2"){  //===for doctors 
      peerid = cam.getParameterByName('peer')
      document.getElementById('connect-to-peer').classList.add('lets-hide')
      document.getElementById('btnclick').classList.add('lets-hide')

      //fetch also patients record
      cam.getpatienthistory(cam.getParameterByName('uid'), cam.getParameterByName('case'))  

    }else{
      peerid = cam.getParameterByName('caller') //===for patients 
      document.getElementById('connect-to-peer').value= cam.getParameterByName('peer')
      document.getElementById('connect-to-peer').classList.add('lets-hide')
      document.getElementById('btnclick').classList.add('lets-hide')

    }
    // Register with the peer server

    console.log('playing video from cam')
    
    cam.startPeer() //===play client video
      
  }//end init

}//===============end obj cam

cam.init()///load




