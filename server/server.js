const io = require('socket.io')(4440, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on('send-message', ({ recipients, text })=>{
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r=>r!==recipient)
            newRecipients.push(id) 
            socket.broadcast.to(recipient).emit('receive-message', {
                recipients: newRecipients, 
                sender: id, 
                text
            })
        })
    })
})

//io.on event listener on server's socket instance, listening 
//for a new client connection, callback function receives socket object
//Retrieves client provided id from the connection's query, when a client
//connects to the server, they can send query parameters, and this line 
//pulls out the id parameter, socket.join puts client's coket 
//into a room named by the client's id

//socket.on('send-message) listens for client emits, expects an object 
//with recipients and text

//filters recipients excluding the current recipient so message won't be sent back
//to sender 

//Swap: For each recipient: Their own id gets removed, sender's ID gets added

//Socket object on the server refers to specific connection instance for 
//each client that connects to server, so each connected client gets 
//its own socket object on the server

//socket broadcasts to its recipients a receive message event that gives 
//newRecipients, sender id, and text

//Server acts as a midleman between client -> broadcast other clients

//.join room, .to sends to the room named after that id