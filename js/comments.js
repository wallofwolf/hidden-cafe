import { dbService, authService } from "./firebase.js";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { getDate } from "./util.js";

export const viewComments = async path => {
  const postId = path.split("/view-post-")[1];
  // 댓글 작성자 프로필이미지, 닉네임 가져오기
  const user = authService.currentUser;
  const userProfile = document.querySelector(".comment-profile-img");
  userProfile.setAttribute("src", user.photoURL ?? "/img/profile-img.png");
  const userNickname = document.querySelector(".comment-user-name");
  userNickname.textContent = user.displayName ?? user.email.split("@")[0];

  // 댓글 등록 버튼 이벤트 등록
  const btn = document.querySelector(".comment-post-btn");
  btn.addEventListener("click", () => createComment(path));

  // Firebase에서 해당 게시글의 댓글 받아오기
  const q = query(collection(dbService, "comment"), where("postId", "==", postId));
  const querySnapshot = await getDocs(q);
  const commentObjList = [];
  querySnapshot.forEach(doc => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    commentObjList.push(commentObj);
  });

  const commentList = document.querySelector(".comment-list");
  commentList.innerHTML = "";
  commentObjList.forEach(commentObj => {
    const isOwner = user.uid === commentObj["creatorId"];
    const tempHtml = `
    <div class="comment-user">
    <img
    class="comment-profile-img"
    src="${commentObj.profileUrl ?? "/img/profile-img.png"}"
    alt="profile-img"
    />
    <div class="comment-user-name">${commentObj.nickname}</div>
    </div>
    <div class="comment-description">
    ${commentObj.contents}
    </div>
    <div class="comment-create-date">${commentObj.createdAt}</div>
    <div class="comment-buttons">
    <button class="${isOwner ? "comment-modify-btn" : "noDisplay"}">수정</button>
    <button class="${isOwner ? "comment-delete-btn" : "noDisplay"}">삭제</button>
    </div>`;

    const commentRow = document.createElement("div");
    commentRow.classList.add("comment-row");
    commentRow.innerHTML = tempHtml;
    commentList.appendChild(commentRow);
  });
};

const createComment = async path => {
  const postId = path.split("/view-post-")[1];
  const user = authService.currentUser;

  const newComment = document.querySelector(".new-comment");
  const newCommentValue = newComment.value;

  if (!newCommentValue) {
    alert("댓글을 입력하세요.");
    return;
  }

  await addDoc(collection(dbService, "comment"), {
    commentID: uuidv4(),
    contents: newCommentValue,
    createdAt: getDate(),
    creatorId: user.uid,
    email: user.email,
    nickname: user.displayName ?? user.email.split("@")[0],
    postId: postId,
    profileUrl: user.photoURL,
  })
    .then(() => {
      console.log("댓글 작성 완료");
      newComment.value = "";
    })
    .catch(console.error);
};
