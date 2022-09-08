const urlBase = 'http://contacts27.com/LAMPAPI';
const extension = 'php';
// let contacts = [];
let contacts = [
  {
    FirstName: 'John',
    LastName: 'Appleseed',
    Email: 'Johnnyappleseed@gmail.com',
    PhoneNumber: '123-456-7890',
    DateCreated: '10-10-2020',
  },
  {
    FirstName: 'Tanner',
    LastName: 'Hawkins',
    Email: 'tanndlin@gmail.com',
    PhoneNumber: '123-456-7890',
    DateCreated: '09-26-2001',
  },
];
let contactInModal = null;

showContacts();

// Set up Modal
const modals = [].slice.call(document.getElementsByClassName('modal'));
const showModalBtn = document.getElementById('showModalBtn');
const mainContainer = document.getElementsByClassName('mainContainer')[0];
[].slice
  .call(document.getElementsByClassName('close'))
  .forEach((c) => (c.onclick = closeModal));

// Close on clicking outside of modal
// window.onclick = (e) => {
//   if (
//     !modals.some((modal) => modal.contains(e.target)) &&
//     e.target !== showModalBtn
//   ) {
//     closeModal();
//   }
// };

// Opens modal that called this function
function showModal(modal) {
  modal.style.display = 'block';
  mainContainer.classList.add('haze');
}

// Closes all modals
function closeModal() {
  modals.forEach((modal) => (modal.style.display = 'none'));
  mainContainer.classList.remove('haze');
}

//------------------------------------------------------

function addEntry(contact) {
  contacts.push(contact);
}

// TODO: Do something smart to not create and destroy divs
// Instead reuse and update text
function showContacts() {
  clearTable();
  const table = document.getElementById('contactsTable');

  contacts.forEach((contact) => {
    const row = table.insertRow();
    Object.keys(contact).forEach((key) => {
      if (key == 'ID') return;
      const cell = row.insertCell();
      cell.innerHTML = contact[key];
    });
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

function openContactModal(e) {
  // Get index of contact that was clicked
  const index = e.target.parentNode.rowIndex - 1;
  if (index == -1) return; // Dont show for the header row
  showModal(document.getElementById('contactModal'));

  contactInModal = contacts[index];
  const contact = contacts[index];
  console.log(contact);

  const firstNameField = document.getElementById('updateFirstName');
  const lastNameField = document.getElementById('updateLastName');
  const numberField = document.getElementById('updateNumber');
  const emailField = document.getElementById('updateEmail');
  const dateCreatedTag = document.getElementById('updateDateCreated');

  firstNameField.value = contact.FirstName;
  lastNameField.value = contact.LastName;
  numberField.value = contact.PhoneNumber;
  emailField.value = contact.Email;
  dateCreatedTag.innerHTML = contact.DateCreated;
}

// TODO: Ask for confirmation
function deleteContact() {
  if (!contactInModal) return;
  const { ID } = contactInModal;

  // Send Delete Request to API
  const payload = JSON.stringify({
    ID,
  });

  let url = urlBase + '/DeleteContact.' + extension;

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

        console.log('Successfully deleted contact');
        closeModal();
      }
    };
    xhr.send(payload);

    // If successful, remove from contacts array
  } catch (e) {
    console.error(e);
  }

  contacts = contacts.filter((contact) => contact.ID != ID);
  showContacts();
  closeModal();
}

function updateContact() {
  if (!contactInModal) return;

  const firstNameField = document.getElementById('updateFirstName');
  const lastNameField = document.getElementById('updateLastName');
  const numberField = document.getElementById('updateNumber');
  const emailField = document.getElementById('updateEmail');

  const payload = JSON.stringify({
    ID: contactInModal.ID,
    NewFirst: firstNameField.value,
    NewLast: lastNameField.value,
    NewEmail: emailField.value,
    NewNumber: numberField.value,
  });

  let url = urlBase + '/UpdateContact.' + extension;

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

        console.log('Successfully updated contact');
        closeModal();

        // Update contact in contacts array
        contactInModal.FirstName = firstNameField.value;
        contactInModal.LastName = lastNameField.value;
        contactInModal.Email = emailField.value;
        contactInModal.PhoneNumber = numberField.value;

        showContacts();
      }
    };
    xhr.send(payload);
  } catch (e) {
    console.error(e);
  }
}
