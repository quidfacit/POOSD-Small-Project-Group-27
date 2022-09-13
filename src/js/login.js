function doLogin() {
    function doLogin()
  {
      ID = 0;
      FirstName = "";
      LastName = "";

      let Login = document.getElementById("Login").value;
      let Password = document.getElementById("Password").value;

      document.getElementById("LoginResult").innerHTML = "";

      let tmp = {Login:Login,Password:Password};
      let jsonPayload = JSON.stringify( tmp );

      let url = urlBase + '/Login.' + extension;

      let xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      try
      {
          xhr.onreadystatechange = function()
          {
              if (this.readyState == 4 && this.status == 200)
              {
                  let jsonObject = JSON.parse( xhr.responseText );
                  ID = jsonObject.id;

                  if( ID < 1 )
                  {
                      document.getElementById("LoginResult").innerHTML = "User/Password combination incorrect";
                      return;
                  }

                  FirstName = jsonObject.FirstName;
                  LastName = jsonObject.LastName;

                  saveCookie();

                  window.location.href = "search.html";
              }
          };
          xhr.send(jsonPayload);
      }
      catch(err)
      {
          document.getElementById("LoginResult").innerHTML = err.message;
      }
  }
}

function doRegister() {
    // send to api
      const urlBase = 'http://contacts27.com/LAMPAPI';
      const extension = 'php';

      const payload = JSON.stringify({
          Login: document.getElementById("regUsername").value,
          Password: document.getElementById("regPassword").value,
          FirstName: document.getElementById("firstName").value,
          LastName: document.getElementById("lastName").value  
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

  function loginToggle() {
      let divShown = document.getElementById("loginDiv")
      let divHidden = document.getElementById("register")

      divShown.style.display = "block";
      divHidden.style.display = "none";
  }

  function registerToggle() {
      let divShown = document.getElementById("register")
      let divHidden = document.getElementById("loginDiv")

      divShown.style.display = "block";
      divHidden.style.display = "none";
  }