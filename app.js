import express from "express";
import sequelize from "./db_connect";
import User from "./model/user";
var app = express();

// GET method route
app.get("/", function (req, res) {
  res.send("GET request to the homepage!!!!");
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
});

// POST method route
app.post("/", function (req, res) {
  res.send("POST request to the homepage");
});

app.get("/about", function (req, res) {
  res.send("about");
});

// 물음표 왼쪽 문자가 없거나 포함되거나 ex) /acd , /abcd
app.get("/ab?cd", function (req, res) {
  res.send("ab?cd");
});

// + 왼쪽 문자가 몇개든지 추가 될수있다. ex)  /efgh , /efffffgh
app.get("/ef+gh", function (req, res) {
  res.send("ef+gh");
});

// * 문자 부분에 아무 문자가 들어올 수 있음 ex) /qwer , /qw14hher
app.get("/qw*er", function (req, res) {
  res.send("qw*er");
});

// cd 문자가 포함되거나 안되거나
app.get("/ab(cd)?e", function (req, res) {
  res.send("ab(cd)?e");
});

// z 가 포함된 모든 항목
app.get(/z/, function (req, res) {
  res.send("/z/ 가 포함됨 ");
});

// 콘솔 로그가 먼저 보인후 문자가 보여짐
app.get(
  "/example/b",
  function (req, res, next) {
    console.log("the response will be sent by the next function ...");
    next();
  },
  function (req, res) {
    res.send("Hello from B!");
  }
);

// 배열로 할경우 처음부터 순차적으로 실행됨
var cb0 = function (req, res, next) {
  console.log("CB0");
  next();
};

var cb1 = function (req, res, next) {
  console.log("CB1");
  next();
};

var cb2 = function (req, res) {
  res.send("Hello from C!");
};

app.get("/example/c", [cb0, cb1, cb2]);

//route 활용 get / push /post
app
  .route("/book")
  .get(function (req, res) {
    res.send("Get a random book!!");
  })
  .post(function (req, res) {
    res.send("Add a book");
  })
  .put(function (req, res) {
    res.send("Update the book");
  });

app.get("/userAdd", function (req, res) {
  // 새로운 유저 생성
  User.create({ firstName: "John", lastName: "Doe" }).then((user) => {
    console.log("Jane's auto-generated ID:", user.id);
    res.send(`${user.firstName} ${user.lastName} add success`);
  });
});

app.get("/userUpdate", function (req, res) {
  // 성이 없는 모든 사용자를 "Doe"로 변경
  User.update(
    { lastName: "Doe" },
    {
      where: {
        lastName: null,
      },
    }
  ).then(() => {
    console.log("update Done");
    res.send("user update success");
  });
});

app.get("/userDelete", function (req, res) {
  // Jane 이라는 이름을 가진 사람 삭제
  User.destroy({
    where: {
      firstName: "Jane",
    },
  }).then(() => {
    console.log("Done");
    res.send("user delete success");
  });
});

app.get("/userFindAll", function (req, res) {
  // 모든 유저 찾기
  User.findAll().then((users) => {
    console.log("All users:", JSON.stringify(users, null, 4));
    res.send(`${JSON.stringify(users, null, 4)} \n \n user FindAll success`);
  });
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
