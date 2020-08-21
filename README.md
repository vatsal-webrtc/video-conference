# video-conference
One to one Video conferencing solution

### Technical Components

* Signalling Server based on python-socketio library
* Web Server is also python3 http server 
* For webrtc and functionalities socket.io.client 
* From Application is based oN HTML,CSS,JavaScript and jquery


### Setup Process For the Complete Stack
```
cd signaling
pip install -r requirements.txt
-> requirement.txt installs aiohttp and python-socketio
python server.py

By default the server will run on localhost:9999
```

Turn Server
```
If using a ubuntu instance turn server can be installed using "sudo apt install coturn"
For running turn server : "turnserver -a -o -v -n --no-dtls --no-tls -u username:credential -r realmName"

(where username and credential can be used as it because it is the same in {ROOT_DIRECTORY}/web/main.js file and it can be altered accordingly)
```
Web Server
```
cd web
python -m http.server 7000

By default the application will run on localhost:7000 which can be changed as per the need 

Now go to the browser and hit localhost:7000 , the app will come up , one the same in two tabs or two different browsers or best with two different camera devices and the call will be connected
```

### Deployment 
**The deployment needs SSL in order to access the getuserMedia functionalities hence it is deployed the app on an aws freetier EC2 instance and the port is redirected using "ngrok" the url of which is [this](https://2e5ed7f80d19.ngrok.io/)**

Static deployment is also done over github link
## Challenges
The signalling server was not able to work over ngrok and hence was not able to test the same over public network 

### Points for discussion 
*For countering the Network connectivity issue where outbound/inbound traffic are blocked by the firewall , a TURN server can be established to channel the media from turn *server and for Signallig STUN can be used to punch hole from private ip to public ip in order to discover the devices 

Security Issues
Ip address should be send by the signalling server only when both the ends have accepted the communication
Input Validation should be performed on javascript elements
Webrtc calls are DTLS-SRTP protected

