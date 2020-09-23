const form = document.querySelector('form');
const spinner = document.getElementById('spinner');
const port = 4000;
const apiURL = (path = '') => `https://desabafo-api.vercel.app/${path}`;

const toggleLoad = () => {
    if(spinner.style.display !== 'block'){
        spinner.style.display = 'block';
        form.style.display = 'none'
    } else {
        spinner.style.display = 'none';
        form.style.display = 'block'
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();
    toggleLoad();
    const secretData = new FormData(form);
    const name = secretData.get('name');
    const secret = secretData.get('secret');
    const secretObj = {
        name: name || 'Anonymous',
        secret: secret,
    };
    fetch(apiURL('secrets'), {
        method: 'POST',
        body: JSON.stringify(secretObj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.msg || 'Now they all know.');
        form.reset();
        location.replace('./../secrets/secrets.html');
    })
    .catch(err => alert('Something went wrong. Please wait a few seconds then try again'))
    .finally(() => {
        toggleLoad();
    })
})
