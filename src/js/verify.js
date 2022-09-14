function verifyInput(firstName, lastName, phone, email) {
  if (!firstName || !lastName || !phone || !email)
    return 'All fields are required';

  if (!verifyPhone(phone))
    return 'Invalid phone number, please use the format: 555-555-5555';

  if (!verifyEmail(email)) return 'Invalid email';

  return true;
}

function verifyRegisterForm(firstName, lastName, username, password) {
  if (!firstName || !lastName || !username || !password)
    return 'All fields are required';

  if (!verifyUsername(username))
    return 'Username must be at least 4 characters long and not contain symbols';

  if (!verifyPassword(password))
    return 'Password must be at least 8 characters long';

  return true;
}


function verifyEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function verifyPhone(phone) {
  const re = /^\d{3}-\d{3}-\d{4}$/;
  return re.test(phone);
}

function verifyName(name) {
  const re = /^[a-zA-Z]+$/;
  return re.test(name);
}

function verifyUsername(username) {
  // Must be at least 4 characters long and not symbols
  const re = /^[a-zA-Z0-9]{4,}$/;
  return re.test(username);
}

function verifyPassword(password) {
  // Must be at least 8 characters long
  return password.length >= 8;
}

function inputEdit(e, validateFunction) {
  if (validateFunction(e.value)) {
    e.nextElementSibling.classList.add('good');
    e.nextElementSibling.classList.remove('bad');
    return true;
  }

  e.nextElementSibling.classList.add('bad');
  e.nextElementSibling.classList.remove('good');
  return false;
}