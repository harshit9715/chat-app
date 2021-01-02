const socket = io()

// Formattings

const fTime = 'hh:mm a'

// Elements
const $chatForm = document.querySelector('#message-form'),
      $msgFormInput = $chatForm.querySelector('input'),
      $msgFormButton = $chatForm.querySelector('button'),
      $locationButton = document.querySelector('#send-location'),
      $messages = document.querySelector('#messages');

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// Templates
const msgTemplate = document.querySelector('#message-template').innerHTML
const locTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// options
const {room, username} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage) // grab styling to get extra height such as margin and padding of the element
    const newMessageMargin = parseInt(newMessageStyles.marginBottom) // grab margins and paddings from message
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin // add margin and padding to default height

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }


}


socket.on('message', ({username, text, createdAt}) => {
    const html = Mustache.render(msgTemplate, {
        username,
        message: text,
        createdAt: moment(createdAt).format(fTime)
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', ({username, url, createdAt}) => {
    console.log(url);
    const html = Mustache.render(locTemplate, {
        username,
        url,
        createdAt: moment(createdAt).format(fTime)
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({room, users}) =>{
    const html = Mustache.render(sidebarTemplate, {
        room, 
        users
    })
    document.querySelector('#sidebar').innerHTML = html
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
            alert(error)
        }
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

socket.emit("join", {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})