const socket = io()

// Elements

const $chatForm = document.querySelector('#msg-form'),
      $msgFormInput = $chatForm.querySelector('input'),
      $msgFormButton = $chatForm.querySelector('button'),
      $locationButton = document.querySelector('#sendLocation'),
      $messages = document.querySelector('#messages');

// Templates
const msgTemplate = document.querySelector('#message-template').innerHTML
const locTemplate = document.querySelector('#location-template').innerHTML

socket.on('message', (message) => {
    const html = Mustache.render(msgTemplate, {message})
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locTemplate, {url})
    $messages.insertAdjacentHTML('beforeend', html)
})



$chatForm.addEventListener('submit',  (e) => {
    e.preventDefault()

    $msgFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {

        $msgFormButton.removeAttribute('disabled')
        $msgFormInput.value = ''
        $msgFormInput.focus()
        
        if (error) {
            return console.log(error)
        }
        console.log('delivered')
    })

})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('Geolocation is not supported by your browser.')
    $locationButton.setAttribute('disabled', 'disabled'); 
    navigator.geolocation.getCurrentPosition((position) => {
           
        socket.emit('sendLocation', {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, (error) => {
            $locationButton.removeAttribute('disabled');
            if (error) {
                return console.log('location was not received.');
            }
        })
    })
})