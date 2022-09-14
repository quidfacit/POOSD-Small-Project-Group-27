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
    const FirstName = document.getElementById('firstNameInput').value;
    const LastName = document.getElementById('lastNameInput').value;
    const Login = document.getElementById('usernameInput').value;
    const Password = document.getElementById('passwordInput').value;

    const registerResultLabel = document.getElementById('registerResult');
    const isValid = verifyRegisterForm(FirstName, LastName, Login, Password);
    if (isValid !== true) {
        registerResultLabel.innerHTML = isValid;
        return;
    }

    const payload = JSON.stringify({
        FirstName, LastName, Login, Password
    });

    sendRequest('Register', payload, (res) => {
        console.log('Successfully registered user.');

        // Tell user they are registered
        registerResultLabel.innerHTML = 'You have been successfully registered'
        // Clear fields
        ['firstNameInput', 'lastNameInput', 'usernameInput', 'passwordInput'].forEach((id) => {
            document.getElementById(id).value = '';
        });
    }, (err) => {
        document.getElementById('registerResult').innerHTML = `An error occurred while registering you. ${err}`;
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