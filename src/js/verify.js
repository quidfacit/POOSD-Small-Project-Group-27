function verifyInput(firstName, lastName, phone, email) {
  if (!firstName || !lastName || !phone || !email)
    return 'All fields are required';

  if (!verifyPhone(phone))
    return 'Invalid phone number, please use the format: 555-555-5555';

  if (!verifyEmail(email)) return 'Invalid email';

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

function inputEdit(e, validateFunction) {
  if (validateFunction(e.value)) {
    e.nextElementSibling.classList.add('hidden');
    return true;
  }

  // Show the incorrectLabel
  // Which is a sibling of the input
  e.nextElementSibling.classList.remove('hidden');
  return false;
}


// Set up Enter for inputs
["firstNameInput", "lastNameInput", "emailInput", "numberInput"]
  .forEach((id) => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key == 'Enter') {
        document.getElementById('addButton').click();
        e.preventDefault();
      }
    });
  });

["updateFirstName", "updateLastName", "updateEmail", "updateNumber"]
  .forEach((id) => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key == 'Enter') {
        document.getElementById('updateButton').click();
        e.preventDefault();
      }
    });
  });
