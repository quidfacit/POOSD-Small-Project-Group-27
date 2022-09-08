const urlBase = 'http://contacts27.com/LAMPAPI';
const extension = 'php';

// Set up Modal

const modal = document.getElementById('modal');
const close = document.getElementById('close');
const showModalBtn = document.getElementById('showModalBtn');
const mainContainer = document.getElementsByClassName('mainContainer')[0];
document.getElementById('close').onclick = closeModal;

// Close on clicking outside of modal
window.onclick = (e) => {
  if (!modal.contains(e.target) && e.target !== showModalBtn) {
    closeModal();
  }
};

function showModal() {
  modal.style.display = 'block';
  mainContainer.classList.add('haze');
}

function closeModal() {
  modal.style.display = 'none';
  mainContainer.classList.remove('haze');
}

//------------------------------------------------------

function addEntry(contact) {
  const table = document.getElementById('contactsTable');

  // Add the new row under the header row
  const row = table.insertRow(1);
  console.log(contact);

  Object.keys(contact).forEach((key) => {
    if (key == 'ID') return;
    const cell = row.insertCell();
    cell.innerHTML = contact[key];
  });
}

function clearTable() {
  // Remove all children except the headers
  const tbody = document.getElementById('contactsTable').children[0];
  tbody.replaceChildren(tbody.children[0]);
}

function search() {
  const searchTerm = document.getElementById('searchInput').value;
  console.log(searchTerm);

  clearTable();

  // Get results from API
  const jsonPayload = JSON.stringify({
    SearchTerm: searchTerm,
    UserID: readCookie(),
  });

  let url = urlBase + '/SearchContacts.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById('searchResult').innerHTML =
          'Contacts have been retrieved';
        const { Contacts: contacts, Error: err } = JSON.parse(xhr.responseText);
        console.log(contacts);

        if (err) {
          throw new Error(err);
        }

        contacts.forEach((contact) => {
          addEntry(contact);
        });
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById('searchResult').innerHTML = err.message;
  }
}

function addContact() {
  const firstNameField = document.getElementById('firstNameInput');
  const lastNameField = document.getElementById('lastNameInput');
  const numberField = document.getElementById('numberInput');
  const emailField = document.getElementById('emailInput');

  // send to api
  const payload = JSON.stringify({
    FirstName: firstNameField.value,
    LastName: lastNameField.value,
    Email: emailField.value,
    PhoneNumber: numberField.value,
  });

  let url = urlBase + '/AddContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const { Error: err } = JSON.parse(xhr.responseText);
        if (err) {
          throw new Error(err);
        }

        console.log('Successfully added contact');
        addEntry(payload);
      }

      // Clear fields
      [(firstNameField, lastNameField, numberField, emailField)].forEach(
        (e) => (e.value = '')
      );
    };
    xhr.send(payload);
  } catch (e) {
    console.error(e);
  }
}

function readCookie() {
  console.log(document.cookie);
  return 1;
}
