const urlBase = 'http://contacts27.com/LAMPAPI';
const extension = 'php';
let contacts = [];
let contactInModal = null;
const DISPLAY_AMOUT = 30;
let displayedAmount = 0;

search();

// --------------------------- For Testing ---------------------------

for (let i = 0; i < 10; i++) {
  addEntry({
    ID: i,
    FirstName: 'John' + i,
    LastName: 'Doe' + i,
    Email: `JohnnyAppleseed${i}@gmail.com`,
    Phone: '555-555-5555',
    DateCreated: '1999-01-01',
  });
}

showContacts(true);

// -------------------------- Set up Modal --------------------------
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

  addResult = document.getElementById('addResult');
  addResult.style.display = 'none';
}

// ------------------------ Set up lazy loading ------------------------
{
  const container = document.getElementById('tableContainer');
  container.addEventListener('scroll', () => {
    // you're at the bottom of the page
    if (
      container.offsetHeight + container.scrollTop >=
      container.scrollHeight
    ) {
      // Max amount shown
      if (displayedAmount == contacts.length) return;

      console.log(
        `Showing ${DISPLAY_AMOUT} more contacts\n` +
          `${displayedAmount + DISPLAY_AMOUT} ` +
          `out of ${contacts.length} contacts shown`
      );

      showContacts(false);
    }
  });
}

//------------------------------------------------------

function addEntry(contact) {
  contacts.push(contact);
}

function showContacts(resetTable) {
  if (resetTable) {
    displayedAmount = 0;
    clearTable();
  }

  // Show DISPLAY_AMOUNT more contacts
  const table = document.getElementById('contactsTable');

  for (let i = 0; i < DISPLAY_AMOUT && displayedAmount < contacts.length; i++) {
    const contact = contacts[displayedAmount++];

    const { FirstName, LastName, Email, Phone, DateCreated } = contact;
    const row = table.insertRow();
    [FirstName, LastName, Email, Phone, DateCreated].forEach((val) => {
      const cell = row.insertCell();
      cell.innerHTML = val;
    });
  }
}

function clearTable() {
  // Remove all children except the headers
  const tbody = document.getElementById('contactsTable').children[0];
  tbody.replaceChildren(tbody.children[0]);
}

function search() {
  const searchTerm = document.getElementById('searchInput').value;
  console.log(searchTerm);

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
        const { Contacts: newContacts, Error: err } = JSON.parse(
          xhr.responseText
        );

        // If no contacts found, clear table
        if (err) {
          document.getElementById('searchResult').innerHTML = err;
          contacts = [];
        }

        contacts = newContacts;
        showContacts(true);
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.log(err);
  }
}

function addContact() {
  const firstNameField = document.getElementById('firstNameInput');
  const lastNameField = document.getElementById('lastNameInput');
  const numberField = document.getElementById('numberInput');
  const emailField = document.getElementById('emailInput');

  const isValid = verifyInput(
    firstNameField.value,
    lastNameField.value,
    numberField.value,
    emailField.value
  );

  const addResult = document.getElementById('addResult');
  if (isValid !== true) {
    addResult.style.display = 'block';
    addResult.innerHTML = isValid;
    return;
  }

  // send to api
  const payload = JSON.stringify({
    FirstName: firstNameField.value,
    LastName: lastNameField.value,
    Email: emailField.value,
    PhoneNumber: numberField.value,
    UserID: readCookie(),
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

        // Call search to add the contact if it matches the search
        search();
      }

      // Clear fields
      [firstNameField, lastNameField, numberField, emailField].forEach(
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
  closeModal();
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

  firstNameField.value = contact.FirstName;
  lastNameField.value = contact.LastName;
  numberField.value = contact.Phone;
  emailField.value = contact.Email;

  console.log(contact.Email);
  console.log(emailField.value);
}

// TODO: Ask for confirmation
function deleteContact() {
  if (!contactInModal) return;
  const { ID } = contactInModal;

  // // Send Delete Request to API
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
