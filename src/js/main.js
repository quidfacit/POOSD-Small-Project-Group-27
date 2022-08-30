console.log("Hello World!");

function addEntry(firstName, lastName, age) {
  const table = document.getElementById("contactsTable");

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
  const tbody = document.getElementById("contactsTable").children[0];
  tbody.replaceChildren(tbody.children[0]);
}

function search() {
  const searchTerm = document.getElementById("searchInput").value;
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
  const firstName = document.getElementById("firstNameInput").value;
  const lastName = document.getElementById("lastNameInput").value;
  const number = document.getElementById("numberInput").value;
  const email = document.getElementById("emailInput").value;

  const dateCreated = Date.now();

  console.log(`${firstName},${lastName},${number},${email},`);

  // send to api
}
