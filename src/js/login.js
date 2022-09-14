function doLogin() {
    const Login = document.getElementById('loginName').value;
    const Password = document.getElementById('loginPassword').value;

    const payload = JSON.stringify({ Login: Login, Password: Password });
    sendRequest('Login', payload, (res) => {
        const { FirstName, LastName, ID } = JSON.parse(res.responseText);
        if (ID < 1) {
            return;
        }

        saveCookie(FirstName, LastName, ID);
        window.location.href = 'contact.html';
    });
}

function doRegister() {
    const payload = JSON.stringify({
        Login: document.getElementById('loginName').value,
        Password: document.getElementById('loginPassword').value,
        FirstName: document.getElementById('FirstName').value,
        LastName: document.getElementById('LastName').value,
    });


    sendRequest('Register', payload, (res) => {
        console.log('Successfully registered user.');

        // Tell user they are registered
        document.getElementById('registerResult').innerHTML = 'You have been successfully registered'

        // Clear fields
        document.getElementById('FirstName').value = '';
        document.getElementById('LastName').value = '';
        document.getElementById('loginName').value = '';
        document.getElementById('loginPassword').value = '';
    });
}

function loginToggle() {
    let divShown = document.getElementById('LoginDiv');
    let divHidden = document.getElementById('register');

    divShown.style.display = 'block';
    divHidden.style.display = 'none';
}

function registerToggle() {
    let divShown = document.getElementById('register');
    let divHidden = document.getElementById('LoginDiv');

    divShown.style.display = 'block';
    divHidden.style.display = 'none';
}

function saveCookie(FirstName, LastName, ID) {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie =
        'firstName=' +
        FirstName +
        ',LastName=' +
        LastName +
        ',ID=' +
        ID +
        ';expires=' +
        date.toGMTString();
}