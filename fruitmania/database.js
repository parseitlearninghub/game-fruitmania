import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  onValue,
  query,
  orderByKey,
  limitToLast,
  push,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyCFqgbA_t3EBVO21nW70umJOHX3UdRr9MY",
  authDomain: "parseit-8021e.firebaseapp.com",
  databaseURL:
    "https://parseit-8021e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parseit-8021e",
  storageBucket: "parseit-8021e.appspot.com",
  messagingSenderId: "15166597986",
  appId: "1:15166597986:web:04b0219b1733780ae61a3b",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

async function getparser_username() {
  const usernameRef = ref(database, `PARSEIT/game/fruitmania`);
  const snapshot = query(usernameRef, orderByKey(), limitToLast(4));
  onValue(snapshot, async (snapshot2) => {
    if (snapshot2.exists()) {
      const reversed = Object.keys(snapshot2.val()).reverse();
      const viewLeaderboard = document.getElementById("highscore-content");
      viewLeaderboard.innerHTML = "";
      let append = "";
      let count = 1;
      reversed.forEach((key) => {
        append += `
           <div class="highscore-item">
              <div class="highscore-rank"><img src="./img/icon/Champion${count}.png" class="imgTitle"/></div>
              <div class="highscore-score">${key}</div>
              <div class="highscore-name">${snapshot2.val()[key].fullName}</div>
            </div>
          `;
        viewLeaderboard.innerHTML = append;
        count++;
      });
    } else {
      console.log("No data available");
      return null;
    }
  });
}
getparser_username();

document
  .getElementById("restart-game-btn")
  .addEventListener("click", (event) => {
    setScore(
      localStorage.getItem("score"),
      localStorage.getItem("user-parser")
    );
  });

async function setScore(score, user) {
  await getFullName(user);
  await update(ref(database, `PARSEIT/game/fruitmania/${score}`), {
    fullName: localStorage.getItem("fullName"),
  });
}

async function getFullName(id) {
  await get(ref(database, `PARSEIT/administration/students/${id}`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        const fullName =
          snapshot.val().firstname + " " + snapshot.val().lastname;
        localStorage.setItem("fullName", fullName);
        return fullName;
      } else {
        console.log("No data available");
        return null;
      }
    }
  );
}
