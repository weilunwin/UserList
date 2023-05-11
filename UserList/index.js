const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USER_PER_PAGE = 20;

const userList = [];
let filterUsers = [];
const userCard = document.querySelector("#user-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");

//user資料
  axios.get(INDEX_URL).then(function (response) {
    userList.push(...response.data.results);
    renderPaginator(userList.length);
    renderUserList(getUserByPage(1));
  });

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
      <button class="btn btn-info btn-add-favorite" id="user-favorite" data-user-id="${user.id}">+</button>
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
//Search
searchForm.addEventListener("submit", function submitOnSearch(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  filterUsers = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword) ||
      user.surname.toLowerCase().includes(keyword)
  );
  if (filterUsers.length === 0) {
    return alert("Cannot find " + keyword);
  }
  renderPaginator(filterUsers.length);
  renderUserList(getUserByPage(1));
});
//分頁器
function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / USER_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

//一頁顯示幾個user
function getUserByPage(page) {
  const data = filterUsers.length ? filterUsers : userList;
  const startIndex = (page - 1) * USER_PER_PAGE;
  return data.slice(startIndex, startIndex + USER_PER_PAGE);
}
//分頁器監聽
paginator.addEventListener("click", function onPaginatorClick(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  renderUserList(getUserByPage(page));
});
//加好友監聽
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favorite')) || []
  const user = userList.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('此用戶已加入好友')
  }
  list.push(user)
  localStorage.setItem('favorite', JSON.stringify(list))
}
//監聽器
userCard.addEventListener("click", function onPanelClick(event) {
  if (event.target.matches("#show-user")) {
    showUserMedal(Number(event.target.dataset.userId));
  } else if (event.target.matches('#user-favorite')) {
    addToFavorite(Number(event.target.dataset.userId))
  }
});

