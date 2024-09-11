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
    videoEl.srcObject = stream
    //videoEl.muted = true
  },
  
  playVideoFromCamera : async () => {
    console.log('...playing local')
    try{
        const constraints = {'video': true, 'audio': true};
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement = document.querySelector('#local-video');
        
        videoElement.srcObject = localStream;
        
        videoElement.onloadedmetadata = () => {
          //videoElement.muted=true
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
      //cam.playVideoFromCamera()
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
    if(cam.getParameterByName('id')==="2"){  //===for doctors 
      localStream.getTracks().forEach((track) => {
        /////console.log(track)
        if (track.readyState == 'live') {
            track.stop();
            //console.log('stopping ',track.id)
        }
      });
      videoElement.srcObject = null
    
    }else{
      localStream.getTracks().forEach((track) => {
        //console.log(track)
        if (track.readyState == 'live') {
            track.stop();
            //console.log('stopping ',track.id)
        }
      });
      videoElement.srcObject = null
    
      remoteStream.getTracks().forEach((track) => {
        //console.log(track)
        if (track.readyState == 'live') {
            track.stop();
            //console.log('stopping ',track.id)
        }
      });
      videoEl.srcObject =  null
    }
   
/*
    */

    messagesEl.innerHTML=""

    
    
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
        remoteStream = stream
        call.on('stream', cam.renderVideo);
    })
    .catch((err) => {
        cam.logMessage('Failed to get local stream', err);
    });
      
  },//end function connectopeer()


  getpatienthistory: async(doc_id,caseno)=>{

    console.log('fired ==== getpatienthistory() ')

    await fetch(`http://192.168.89.221:10000/getpatienthistory/${doc_id}/${caseno}`)
    //await fetch(`https://osndp.onrender.com/getpatienthistory/${doc_id}/${caseno}`)
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

        document.getElementById('femail').value = document.getElementById('patient_email').value 
        document.getElementById('fdoclicense').value = document.getElementById('doc_license').value 
        
    })
    .catch((error) => {
        console.error('Error:', error)
    })

  }, //===end patient history

  //===== rx cart
  rxcart:[],
  orx:{},
  afields:['fdrug','fdosage','fqty','fduration'],
  afieldname:['Drug','Dosage','Qty','Duration'],

  checkrxcart:()=>{
    console.log('===checkrxcart()=====')
    let cnt = 0

    cam.afields.some(function(item,index){
   
      if(document.getElementById(item).value == ""){
         
        cnt ++

        Toastify({
          text: ` ${cam.afieldname[index]} field is required!`,
          duration:3000,
         // close:true,
          position:'center',
          escapeMarkup:false, //to create html
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
        }).showToast();
        
        document.getElementById(item).focus()
        
        return true; //===exit ffrom the  loop

      }//eif

      console.log("item is :"+item+" index is : "+index);
    });

    //if  everything ok add to cart
    if(cnt<=0){
      cam.addtorx()
    
    }
    
  },

  //add to cart
  addtorx:()=>{
  
    console.log('addtorx()====')
   
  
    /*
    cam.afields.forEach( (element) => {
      if(document.getElementById(element).value == ""){
        let  idx = cam.afields.indexOf( element )
        console.log( 'fieldname---', idx )
        Toastify({
          text: ` ${element, cam.afieldname[idx]} field is required!`,
          duration:3000,
         // close:true,
          position:'center',
          escapeMarkup:false, //to create html
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
        }).showToast();
        return true;
        
      }//eif
      
    })
  */
    cam.orx.meds = document.getElementById('fdrug').value.toUpperCase()
    cam.orx.dosage = document.getElementById('fdosage').value
    cam.orx.qty = document.getElementById('fqty').value
    cam.orx.duration = document.getElementById('fduration').value
    
    cam.rxcart.push( cam.orx )

    console.log('shopping cart content ==========', cam.rxcart)
    
    var table = document.getElementById("rxlist"),
    tbody = table.getElementsByTagName("tbody")[0],
    cell, row

    console.log( Object.keys( cam.orx).length )
    //====end for
    for(var i = 0; i  < 1 ;  ++i)
      {
        row = document.createElement("tr");
        
        // helpful also ---> for( let xkey in Object.keys( cam.orx).length ){
        for (let property in cam.orx) {
          console.log('key:' + property, 'value:'+ cam.orx[property]);
          cell= document.createElement("td")
          cell.innerHTML = cam.orx[property]
          row.appendChild( cell )

        }//end for

        tbody.appendChild( row )        
        //prints out 1, 2, 3, 4, 5
      }
    
    cam.resetformcart()
  
  },

  resetformcart:()=>{
    console.log('===resetformcart()====')

    cam.afields.forEach( (element) => {
      document.getElementById(element).value = ""
    })
    
    cam.orx = {} //reset cart obj

    document.getElementById('fdrug').focus()
    
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
      peerid = cam.getParameterByName('patient') //===for patients 
      document.getElementById('connect-to-peer').value= cam.getParameterByName('peer')
      document.getElementById('connect-to-peer').classList.add('lets-hide')
      document.getElementById('btnclick').classList.add('lets-hide')
      document.getElementById('btnrx').classList.add('lets-hide')
      

    }
    
    console.log('playing video from cam')
    cam.playVideoFromCamera()
    
    cam.startPeer() //===play client video
    //===vaidate form
    util.loadFormValidation('#medrxForm')

   
    document.getElementById('fcaseno').value = cam.getParameterByName('case')
    
    
    const curr_date = util.getDate()
    
    const curr_pos = cam.getParameterByName('patient').lastIndexOf('-')
    const patient_name = cam.getParameterByName('patient').substring(0, curr_pos);

    const doc_pos   = cam.getParameterByName('peer').lastIndexOf('-')
    const doc_name =  cam.getParameterByName('peer').substring(0, doc_pos);

   // let  xvalue = `${curr_date}\n\n To whom it may concern,\n\nThis is to certify that ${patient_name}, of legal age, residing in ( City, Manila ), is diagnosed with Ulcer and is required to rest for "one" (1) week.\n\nThis medical certificate is being issued for whatever purposes it may serve my patient.\n`
    
    //console.log(xvalue)
    //test medcert
    document.getElementById('fpatient').value = patient_name
    document.getElementById('fdoctor').value = doc_name

    //document.getElementById('fmedcert').value =  xvalue

  }//end init

}//===============end obj cam

cam.init()///load




