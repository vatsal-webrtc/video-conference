


// Config variables: change them to point to your own servers
const SIGNALING_SERVER_URL = 'http://localhost:9999';
// const SIGNALING_SERVER_URL = 'https://f168a1598114.ngrok.io:9999';

const TURN_SERVER_URL = 'localhost:3478';
const TURN_SERVER_USERNAME = 'username';
const TURN_SERVER_CREDENTIAL = 'credential';
// WebRTC config: you don't have to change this for the example to work
// If you are testing on localhost, you can just use PC_CONFIG = {}
const PC_CONFIG = {
  iceServers: [
    {
      urls: 'turn:' + TURN_SERVER_URL + '?transport=tcp',
      username: TURN_SERVER_USERNAME,
      credential: TURN_SERVER_CREDENTIAL
    },
    {
      urls: 'turn:' + TURN_SERVER_URL + '?transport=udp',
      username: TURN_SERVER_USERNAME,
      credential: TURN_SERVER_CREDENTIAL
    }
  ]
};

// Signaling methods
let socket = io(SIGNALING_SERVER_URL, { autoConnect: false });

socket.on('data', (data) => {
  console.log('Data received: ',data);
  handleSignalingData(data);
});

socket.on('ready', () => {
  console.log('Ready');
  // Connection with signaling server is ready
  createPeerConnection();
  sendOffer();
});

let sendData = (data) => {
  socket.emit('data', data);
};

// WebRTC methods
let pc;
let localStream;
let remoteStreamElement = document.querySelector('#remoteStream');

//for fetching the local streams
let getLocalStream = () => {
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then((stream) => {
      console.log('Stream found');
      localStream = stream;
      let selfStreamElement = document.querySelector('#selfView');
      selfStreamElement.srcObject= stream;
      // var textnode = document.createTextNode("Water");
      // selfStreamElement.appendChild(textnode);
      //append the "Joinee Name" after submit button is clicked
      $('#name').append(userName);
      // Connect after making sure that local stream is availble
      socket.connect();
    })
    .catch(error => {
      console.error('Stream not found: ', error);
    });
}

// RTC PEER connection object for adding the stream
let createPeerConnection = () => {
  try {
    pc = new RTCPeerConnection(PC_CONFIG);
    pc.onicecandidate = onIceCandidate;
    pc.onaddstream = onAddStream;
    pc.addStream(localStream);
    console.log('PeerConnection created');
  } catch (error) {
    console.error('PeerConnection failed: ', error);
  }
};
// Offer and answer for communication
let sendOffer = () => {
  console.log('Send offer');
  pc.createOffer().then(
    setAndSendLocalDescription,
    (error) => { console.error('Send offer failed: ', error); }
  );
};

let sendAnswer = () => {
  console.log('Send answer');
  pc.createAnswer().then(
    setAndSendLocalDescription,
    (error) => { console.error('Send answer failed: ', error); }
  );
};

let setAndSendLocalDescription = (sessionDescription) => {
  pc.setLocalDescription(sessionDescription);
  console.log('Local description set');
  sendData(sessionDescription);
};

let onIceCandidate = (event) => {
  if (event.candidate) {
    console.log('ICE candidate');
    sendData({
      type: 'candidate',
      candidate: event.candidate
    });
  }
};

let onAddStream = (event) => {
  console.log('Add stream');
  remoteStreamElement.srcObject = event.stream;
  if (remoteStreamElement.srcObject !== undefined) {
        remoteStreamElement.srcObject.then(function() {
          console.log("playback successful");
  // Automatic playback started!
        }).catch(function(error) {
          console.log("playback failed");
          console.log(error);
  // Automatic playback failed.
  // Show a UI element to let the user manually start playback.
        });
      }

};

let handleSignalingData = (data) => {
  switch (data.type) {
    case 'offer':
      createPeerConnection();
      pc.setRemoteDescription(new RTCSessionDescription(data));
      sendAnswer();
      break;
    case 'answer':
      pc.setRemoteDescription(new RTCSessionDescription(data));
      break;
    case 'candidate':
      pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      break;
  }
};
var userName="";
$(document).ready(function () {

  function showFormFromInvitation() {
  $("#login-form-from-invitation").show();
  $("#login-form-from-invitation input.display_name").focus();

  }
  // Action after submitting the button to self name
  showFormFromInvitation();
  $(".userSubmitBtn").click(function (e) {
    userName = $("#userSubmit").val();
    if(userName == ""){
      alert("PLease Enter the User Name");
    } else{
      userFullName= userName.replace(/ /g, '_');
      $("#login-full-background, #login-box").fadeOut("200");
      fetch("/client"+window.location.pathname).then(function(){ getLocalStream();});
    }
    });

    $(".userSubmitBtn").keydown(function (e) {
      if (e.keyCode == 13){
        userName = $("#userSubmit").val();
        if(userName == ""){
          alert("PLease Enter the User Name");
        } else{
          userFullName= userName.replace(/ /g, '_');
          $("#login-full-background, #login-box").fadeOut("200");
          fetch("/client"+window.location.pathname).then(function(){ getLocalStream();});
        }
      }

      });
    })
// Start connection
//getLocalStream();
