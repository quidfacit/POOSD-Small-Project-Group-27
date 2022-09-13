function doRegister() {
    // send to api
      const urlBase = 'http://contacts27.com/LAMPAPI';
      const extension = 'php';

      const payload = JSON.stringify({
          FirstName: document.getElementById("firstName").value,
          LastName: document.getElementById("lastName").value,
          UserID: document.getElementById("regUsername").value,
          UserPassword: document.getElementById("regPassword").value
      });

      let url = urlBase + "/Register." + extension;

      let xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      try {
          xhr.onreadystatechange = function () {
              if (this.readyState == 4 && this.status == 200) {
                  const { Error: err } = JSON.parse(xhr.responseText);
                  if (err) {
                      throw new Error(err);
                  }

                  console.log("Successfully registered user.");

                  //Check if the user exists already
              }

          // Clear fields
              document.getElementById("firstName").value = "";
              document.getElementById("lastName").value = "";
              document.getElementById("regUsername").value = "";
              document.getElementById("regPassword").value = "";
          };

          xhr.send(payload);
      } catch (e) {
          console.error(e);
      }     
  }