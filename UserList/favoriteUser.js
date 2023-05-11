const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USER_PER_PAGE = 20;

const userList = JSON.parse(localStorage.getItem('favorite')) || [];
let filterUsers = [];
const userCard = document.querySelector("#user-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");

//所有user輸出
function renderUserList(data) {
  let userCardHTML = "";
  data.forEach((user) => {
    userCardHTML += ` <div class="col-sm-3"> 
    <div class="mb-2">
    <div class="card m-2" data-user-id="${user.id}">
    <img src="${user.avatar}" class="img img-fluid" data-user-id="${user.id}" alt="user-image">
    <div class="card-body" data-user-id="${user.id}">
      <h4 class="user-name mb-0" data-user-id="${user.id}">${user.name} ${user.surname}</h4>
    </div>
      <div class="card-footer d-flex justify-content-between">
      <button class="btn btn-primary btn-show-user" id="show-user" data-bs-toggle="modal" data-bs-target="#user-modal" data-user-id="${user.id}">More</button>
      <button class="btn btn-danger btn-add-favorite" id="user-favorite-remove" data-user-id="${user.id}">X</button>
  </div>
  </div>
  </div>
  </div>
  `;
  });
  userCard.innerHTML = userCardHTML;
}
//Modal的user輸出
function showUserMedal(id) {
  const modalTitle = document.querySelector(".modal-title");
  const modalImg = document.querySelector(".modal-user-img");
  const modalUserInfo = document.querySelector(".modal-user-info");

  modalTitle.textContent = "";
  modalImg.src = "";
  modalUserInfo.textContent = "";

  axios.get(INDEX_URL + id).then(function (response) {
    const user = response.data;
    modalTitle.textContent = user.name + " " + user.surname;
    modalImg.src = user.avatar;
    modalUserInfo.innerHTML = `
        <p>email:${user.email}</p>
        <p>gender:${user.gender}</p>
        <p>age:${user.age}</p>
        <p>region:${user.region}</p>
        <p>birthday:${user.birthday}</p>
      `;
  });
}
//刪除好友
function removeFavorite(id) {
  const userIndex = userList.findIndex((user) => user.id === id)
  userList.splice(userIndex, 1)
  localStorage.setItem('favorite', JSON.stringify(userList))
  renderUserList(userList)
}

//監聽器
userCard.addEventListener("click", function onPanelClick(event) {
  if (event.target.matches("#show-user")) {
    showUserMedal(Number(event.target.dataset.userId));
  } else if (event.target.matches('#user-favorite-remove')) {
    removeFavorite(Number(event.target.dataset.userId))
  }
});

renderUserList(userList);
