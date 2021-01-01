const socket = io()
const chatForm = document.querySelector('form'),
    msg = document.querySelector('#message'),
    lastMsg1 = document.querySelector('#msg-1'),
    lastMsg2 = document.querySelector('#msg-2')


socket.on('message', (message) => {
    lastMsg2.textContent = `${lastMsg1.textContent}`
    lastMsg1.textContent = `${message}`
})



chatForm.addEventListener('submit',  (e) => {
    e.preventDefault()
    socket.emit('sendMessage', msg.value)

})