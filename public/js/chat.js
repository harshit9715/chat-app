const socket = io()

const counter = document.querySelector('#countLabel');

socket.on('countUpdated', (count) => {
    console.log('the count has been updated!', count)
    counter.textContent = `Total clicks: ${count}`
})

document.querySelector('#increment').addEventListener('click', () => {
    socket.emit('increment')
})












