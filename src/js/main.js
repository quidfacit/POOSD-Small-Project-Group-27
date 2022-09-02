// Set up Modal

const modal = document.getElementById('modal');
const close = document.getElementById('close');
const showModalBtn = document.getElementById('showModalBtn');
const mainContainer = document.getElementsByClassName('mainContainer')[0];
document.getElementById('close').onclick = closeModal;

// When the user clicks anywhere outside of the modal, close it
window.onclick = (e) => {
  if (!modal.contains(e.target) && e.target !== showModalBtn) {
    closeModal();
  }
};

function closeModal() {
  modal.style.display = 'none';
  mainContainer.classList.remove('haze');
}

function showModal() {
  modal.style.display = 'block';
  mainContainer.classList.add('haze');
}

//------------------------------------------------------

function addEntry(firstName, lastName, age) {
  const table = document.getElementById('contactsTable');

  // Add the new row under the header row
  const row = table.insertRow(1);

  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);

  // TODO: prevent code injection
  cell1.innerHTML = firstName;
  cell2.innerHTML = lastName;
  cell3.innerHTML = age;
}

function clearTable() {
  // Remove all children except the headers
  const tbody = document.getElementById('contactsTable').children[0];
  tbody.replaceChildren(tbody.children[0]);
}

function search() {
  const searchTerm = document.getElementById('searchInput').value;
  console.log(searchTerm);

  // clearTable();

  // Get results from API
  // const apiResult = apiSearch(searchTerm)
  //
  // for (const contact of apiResult) {
  //   const { firstName, lastName, age } = contact;
  //   addEntry(firstName, lastName, age);
  // }
}

function addContact() {
  const firstNameField = document.getElementById('firstNameInput');
  const lastNameField = document.getElementById('lastNameInput');
  const numberField = document.getElementById('numberInput');
  const emailField = document.getElementById('emailInput');

  const dateCreated = Date.now();

  console.log(
    `${firstNameField.value},${lastNameField.value},${numberField.value},${emailField.value},`
  );

  [firstNameField, lastNameField, numberField, emailField].forEach(
    (e) => (e.value = '')
  );

  // send to api
}
