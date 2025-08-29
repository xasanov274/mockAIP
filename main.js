let wrapper = document.querySelector(".wrapper");
let input = document.querySelector(".search_inp");
let letterSelect = document.querySelector("#az");
let toggleBtn = document.querySelector(".dl");
let C_name = document.querySelector(".C_name");
let P_nummer = document.querySelector(".P_nummer");
let add = document.querySelector(".add");

add.addEventListener("click", function (e) {
  e.preventDefault();
  if (C_name.value !== "" && P_nummer.value !== "") {
    fetch("https://68a83614bb882f2aa6ddcb4e.mockapi.io/users/users/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: C_name.value,
        number: P_nummer.value,
      }),
    })
    .then((res) => {
      if (res.ok) {
        alert("user successfully added")
        wrapper.innerHTML = null;
        GetData()
        C_name.value = "";
        P_nummer.value = "";
      }
    })
    .catch((err) => {
      console.log(err);
      
    })
  } else {
    alert("iltimos qaytadan urinib koring")
  }
});

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggleBtn.textContent = document.body.classList.contains("light")
    ? "🌞"
    : "🌙";
});

async function GetData() {
  try {
    let response = await fetch(
      "https://68a83614bb882f2aa6ddcb4e.mockapi.io/users/users/"
    );
    let data = await response.json();
    renderData(data);
    input.addEventListener("input", function (e) {
      e.preventDefault();
      let searched = data.filter((card) =>
        card.name
          .toLowerCase()
          .trim("")
          .includes(input.value.toLowerCase().trim(""))
      );

      if (searched.lenght == 0) {
        wrapper.innerHTML = `<h1>Country not found</h1>`;
      } else {
        wrapper.innerHTML = null;
        renderData(searched);
      }
    });

    function sortAZ() {
      let sorted = data.sort((a, b) => b.name.localeCompare(a.name));
      wrapper.innerHTML = null;
      renderData(sorted);
    }

    function sortZA() {
      let sorted = data.sort((a, b) => a.name.localeCompare(b.name));
      wrapper.innerHTML = null;
      renderData(sorted);
    }

    letterSelect.addEventListener("change", function (e) {
      if (e.target.value === "A-Z") {
        sortAZ();
      } else if (e.target.value === "Z-A") {
        sortZA();
      }
    });
  } catch (error) {
    console.log(error);
  }
}

GetData();

function renderData(data) {
  data.map((user) => {
    let div = document.createElement("div");

    div.innerHTML = `
        <div class="wrapper-left">
  <div class="wrapper__left-image">
    <p>
       ${user.name.slice(0, 1).toUpperCase()}
    </p>
  </div>
  <div class="wrapper__left-data">
    <h4>${user.name}</h4>
    <p>+998${
      user.number
    }</p>                                                           
  </div>
</div>
<div class="wrapper-right">
  <i onclick="saveId(${user.id})" class="fas fa-pen"></i>
  <i onclick="deleteContact(${user.id})" class="fas fa-trash"></i>
</div>

        `;
    wrapper.append(div);
  });
}

function deleteContact(id) {
  fetch(`https://68a83614bb882f2aa6ddcb4e.mockapi.io/users/users/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok == true) alert("Contact deleted successfully");
      wrapper.innerHTML = null;
      GetData();
    })
    .catch((err) => {
      console.log(err);
    });
}

function saveId(id) {
  localStorage.setItem("id", JSON.stringify(id));
  editData();
}

function editData() {
  let myId = JSON.parse(localStorage.getItem("id"));

  let newName = prompt("yangi ism kiriting");
  let newNumber = +prompt("new number kiriting");

  if (newName !== "" && newNumber !== "") {
    fetch(`https://68a83614bb882f2aa6ddcb4e.mockapi.io/users/users/${myId}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        number: newNumber,
      }),
    })
      .then((response) => {
        if (response.ok == true) {
          wrapper.innerHTML = null;
          GetData();
          alert("user successfully updated");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    alert("iltimos qaytadan malumot kiriting");
    editData();
  }
}
