const spinner = document.getElementById('spinner');
const port = 4000;
const apiURL = (path = '') => `https://desabafo-api.vercel.app/${path}`;
const secretsList = document.getElementById('secretsList');

//methods
const toggleLoad = () => {
    if (spinner.style.display !== 'block') {
        spinner.style.display = 'block';
        secretsList.style.display = 'none'
    } else {
        spinner.style.display = 'none';
        secretsList.style.display = 'block'
    }
}
const newHTMLelement = (dataObj) => {
    const h3 = document.createElement('h3')
    h3.textContent = dataObj.secret;
    const p = document.createElement('p')
    p.textContent =`by ${dataObj.name}`;
    const div = document.createElement('div')
    div.className = 'card';
    div.appendChild(h3)
    div.appendChild(p);
    secretsList.appendChild(div);
}

toggleLoad();
fetch(apiURL('secrets'), {
    method: 'GET',
})
    .then(response => response.json())
    .then(data => {
        data.reverse();
        data.forEach(secret => {
            newHTMLelement(secret);
        });
        toggleLoad();
    });