import { authService } from "./firebase.js";

const routes = {
  "/": "/pages/main.html",
  "/main": "/pages/main.html",
  "/create-post": "/pages/create-post.html",
  "/mypage": "/pages/mypage.html",
  "/login": "/pages/login.html",
  "/bookmark": "/pages/bookmark.html",
  "/view-post": "/pages/view-post.html",
  404: "/pages/404.html",
};

export const handleLocation = async () => {
  let path = window.location.hash.replace("#", "/");
  if (path.length === 0) {
    path = "/";
  }
  // console.log("handleLocation:", path);

  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());

  const mainPage = document.querySelector("#main-page");
  mainPage.innerHTML = html;

  if (path == "/create-post") {
    console.log(authService.currentUser);
    //왜인진 모르겠으나 메인을 통해 글쓰기로 와야만 currentUser 데이터를 받아 올 수 있음
    // 따라서 email값이 없으면 메인으로 보내도록 예외처리함
    // 추후 새로고침 해도 currentUser값 받아 올 수 있도록 수정 필요
    try {
      const email = authService.currentUser.email;
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      document.getElementById("date").innerHTML = `${year}. ${month}. ${day}`;
      document.getElementById("member-id").innerHTML =
        `<img src="/img/profile-img.png" style="width:1rem; margin-right:0.3rem;"/>` +
        email;
    } catch {
      window.location.hash = "#main";
    }
  }
};
