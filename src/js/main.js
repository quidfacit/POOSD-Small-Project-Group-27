let contacts = [];
let contactInModal = null;
let modalIndex = -1;
const DISPLAY_AMOUT = 30;
let displayedAmount = 0;
let displayMode = "list";
let sortedBy = "DateCreated";

setUserNameLabel();
search();
showContacts(true);

// -------------------------- Set up Modal --------------------------

const modals = Array.from(document.getElementsByClassName("modal"));
const showModalBtn = document.getElementById("showModalBtn");
const mainContainer = document.getElementsByClassName("mainContainer")[0];
Array.from(document.getElementsByClassName("close")).forEach(
  (c) => (c.onclick = closeModal)
);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

["firstNameInput", "lastNameInput", "emailInput", "numberInput"].forEach(
  (id) => {
    document.getElementById(id).addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        addContact();
      }
    });
  }
);

["updateFirstName", "updateLastName", "updateEmail", "updateNumber"].forEach(
  (id) => {
    document.getElementById(id).addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        updateContact();
      }
    });
  }
);

// Opens modal that called this function
function showModal(modal) {
  modal.style.display = "block";
  mainContainer.classList.add("haze");
}

// Closes all modals
function closeModal() {
  modals.forEach((modal) => (modal.style.display = "none"));
  mainContainer.classList.remove("haze");

  document.getElementById("addResult").innerHTML = "";

  Array.from(document.getElementsByClassName("incorrectLabel")).forEach((e) =>
    e.classList.add("hidden")
  );
}

// ------------------------ Set up lazy loading ------------------------
[
  document.getElementById("tableContainer"),
  document.getElementById("cardsContainer"),
].forEach((container) => {
  container.addEventListener("scroll", () => {
    // you're at the bottom of the page
    if (
      container.offsetHeight + container.scrollTop >=
      container.scrollHeight
    ) {
      // Max amount shown
      if (displayedAmount == contacts.length) return;

      showContacts(false);
    }
  });
});

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
  const table = document.getElementById("contactsTable");

  for (let i = 0; i < DISPLAY_AMOUT && displayedAmount < contacts.length; i++) {
    const contact = contacts[displayedAmount++];

    addCard(contact);

    const { FirstName, LastName, Email, PhoneNumber, DateCreated } = contact;
    const row = table.insertRow();
    [FirstName, LastName, Email, PhoneNumber, DateCreated].forEach((val) => {
      const cell = row.insertCell();
      cell.innerHTML = val;
    });
  }

  const displayLabel = document.getElementById("displayLabel");
  displayLabel.innerHTML = `<b>${displayedAmount} - ${contacts.length} displayed</b>`;
}

function addCard(contact) {
  const { FirstName, LastName, Email, PhoneNumber, DateCreated } = contact;

  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `<h1>${FirstName} ${LastName}</h1>
  <div class="card-content">
  <p>${Email}</p>
  <p>${PhoneNumber}</p>
  <p>${DateCreated}</p>
  </div>`;

  document.getElementById("cardsContainer").appendChild(div);
}

function clearTable() {
  // Remove all children except the headers
  const tbody = document.getElementById("contactsTable").children[0];
  tbody.replaceChildren(tbody.children[0]);

  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.replaceChildren();
}

function search() {
  const searchTerm = document.getElementById("searchInput").value;

  // Get results from API
  const jsonPayload = JSON.stringify({
    SearchTerm: searchTerm,
    UserID: readCookie().userId,
  });

  sendRequest(
    "SearchContacts",
    jsonPayload,
    (res) => {
      document.getElementById("searchResult").innerHTML =
        "Contacts have been retrieved";

      const { Contacts: newContacts } = JSON.parse(res.responseText);
      contacts = newContacts.map((c) => {
        c.DateCreated = new Date(c.DateCreated).toDateString();
        return c;
      });
      showContacts(true);
    },
    (err) => {
      // If no contacts found, clear table
      document.getElementById("searchResult").innerHTML = err;
      contacts = [];
      showContacts(true);
    }
  );
}

function addContact() {
  const firstNameField = document.getElementById("firstNameInput");
  const lastNameField = document.getElementById("lastNameInput");
  const numberField = document.getElementById("numberInput");
  const emailField = document.getElementById("emailInput");

  const isValid = verifyInput(
    firstNameField.value,
    lastNameField.value,
    numberField.value,
    emailField.value
  );

  const addResult = document.getElementById("addResult");
  if (isValid !== true) {
    addResult.style.display = "block";
    addResult.innerHTML = isValid;
    return;
  }

  // send to api
  const payload = JSON.stringify({
    FirstName: firstNameField.value,
    LastName: lastNameField.value,
    Email: emailField.value,
    PhoneNumber: numberField.value,
    UserID: readCookie().userId,
  });

  sendRequest("AddContact", payload, (res) => {
    // Call search to add the contact if it matches the search
    search();

    // Clear fields
    [firstNameField, lastNameField, numberField, emailField].forEach(
      (e) => (e.value = "")
    );

    addResult.style.display = "block";
    addResult.innerHTML = "Contact has been added";
  });
}

function sortBy(field) {
  // If already sorted by this field, reverse the order
  if (field === sortedBy) {
    contacts.reverse();
  } else {
    sortedBy = field;
    contacts.sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });
  }

  showContacts(true);
}

function readCookie() {
  const loginCookie = document.cookie
    .split(";")
    .find((c) => c.includes("firstName"));

  if (!loginCookie) {
    window.location.href = "index.html";
    return { firstName: "Lab", lastName: "Rat", userId: -1 };
  }

  const details = loginCookie.split(",").map((e) => e.split("=")[1]);

  // Not logged in
  // send to login page
  if (details.length != 3) {
    window.location.href = "index.html";
    return;
  }

  return { firstName: details[0], lastName: details[1], userId: +details[2] };
}

function logout() {
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

function openContactModal(e) {
  function findIndex(e) {
    // Grid display mode
    if (displayMode === "grid") {
      let target = e.target;
      while (!target.classList.contains("card")) {
        target = target.parentNode;

        // If we reach the body, we are not in a card
        if (target == document.body) return -1;
      }

      return Array.from(
        document.getElementById("cardsContainer").children
      ).indexOf(target);
    }

    // List display mode
    return e.target.parentNode.rowIndex - 1;
  }
  closeModal();

  // Get index of contact that was clicked

  const index = findIndex(e);
  if (index == -1) return; // Dont show for the header row
  showModal(document.getElementById("contactModal"));

  contactInModal = contacts[index];
  modalIndex = index;
  const contact = contacts[index];

  const firstNameField = document.getElementById("updateFirstName");
  const lastNameField = document.getElementById("updateLastName");
  const numberField = document.getElementById("updateNumber");
  const emailField = document.getElementById("updateEmail");

  firstNameField.value = contact.FirstName;
  lastNameField.value = contact.LastName;
  numberField.value = contact.PhoneNumber;
  emailField.value = contact.Email;
}

// TODO: Ask for confirmation
function deleteContact() {
  if (!contactInModal) return;
  const { ID } = contactInModal;

  const shouldContinue = confirm(
    `Are you sure you want to delete ${contactInModal.FirstName} ${contactInModal.LastName}?`
  );

  if (!shouldContinue) return;

  // // Send Delete Request to API
  const payload = JSON.stringify({
    ID,
  });

  sendRequest("DeleteContact", payload, (res) => {
    // Remove the contact from the table
    const table = document.getElementById("contactsTable");
    table.deleteRow(modalIndex + 1);

    // Remove contact from contacts array
    contacts = contacts.filter((contact) => contact.ID != ID);

    contactInModal = null;
    closeModal();
  });
}

function updateContact() {
  if (!contactInModal) return;

  const firstNameField = document.getElementById("updateFirstName");
  const lastNameField = document.getElementById("updateLastName");
  const numberField = document.getElementById("updateNumber");
  const emailField = document.getElementById("updateEmail");

  const isValid = verifyInput(
    firstNameField.value,
    lastNameField.value,
    numberField.value,
    emailField.value
  );

  const updateResult = document.getElementById("updateResult");
  if (isValid !== true) {
    updateResult.style.display = "block";
    updateResult.innerHTML = isValid;
    return;
  }

  const payload = JSON.stringify({
    ID: contactInModal.ID,
    NewFirst: firstNameField.value,
    NewLast: lastNameField.value,
    NewEmail: emailField.value,
    NewNumber: numberField.value,
  });

  sendRequest(
    "UpdateContact",
    payload,
    (res) => {
      closeModal();

      // Update contact in contacts array
      contactInModal.FirstName = firstNameField.value;
      contactInModal.LastName = lastNameField.value;
      contactInModal.Email = emailField.value;
      contactInModal.PhoneNumber = numberField.value;

      // Change the html of the contact in the table
      const table = document.getElementById("contactsTable");
      const row = table.rows[modalIndex + 1];
      row.cells[0].innerHTML = firstNameField.value;
      row.cells[1].innerHTML = lastNameField.value;
      row.cells[2].innerHTML = emailField.value;
      row.cells[3].innerHTML = numberField.value;

      // Change the html of the contact in the cards
      const card =
        document.getElementById("cardsContainer").children[modalIndex];
      card.children[0].innerHTML = `${firstNameField.value} ${lastNameField.value}`;

      const cardContent = card.children[1];
      cardContent.children[0].innerHTML = emailField.value;
      cardContent.children[1].innerHTML = numberField.value;

      updateResult.style.display = "none";
    },
    (err) => {
      updateResult.style.display = "block";
      updateResult.innerHTML = err;
    }
  );
}

function gridLayout() {
  const tableContainer = document.getElementById("tableContainer");
  tableContainer.style.display = "none";
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.style.display = "flex";

  displayMode = "grid";
}

function listLayout() {
  const tableContainer = document.getElementById("tableContainer");
  tableContainer.style.display = "block";
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.style.display = "none";

  displayMode = "list";
}

function setUserNameLabel() {
  const { firstName, lastName } = readCookie();
  const userNameLabel = document.getElementById("userNameLabel");
  userNameLabel.innerHTML = `Logged in as: ${firstName} ${lastName}`;
}

// Set up Enter for inputs
["firstNameInput", "lastNameInput", "emailInput", "numberInput"].forEach(
  (id) => {
    document.getElementById(id).addEventListener("submit", (e) => {
      if (e.key == "Enter") {
        document.getElementById("addButton").click();
        e.preventDefault();
      }
    });
  }
);

["updateFirstName", "updateLastName", "updateEmail", "updateNumber"].forEach(
  (id) => {
    document.getElementById(id).addEventListener("submit", (e) => {
      if (e.key == "Enter") {
        document.getElementById("updateButton").click();
        e.preventDefault();
      }
    });
  }
);
