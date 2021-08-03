// importing all -------------------------------------------------
const express = require("express"); 
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mysql = require("mysql");
require("dotenv").config();

// parsing middleware----------------------------------------------

// bodyParser
/**parse application / n-ww-form-urlencoded */
app.use(bodyParser.urlencoded({ extended: false }));

// parse application / json
app.use(bodyParser.json());

// express handlebars----------------------------------------------
// setting up templating engine
app.engine("hbs", exphbs({ extname: ".hbs" })); // changing the long extname inro simple ext
app.set("view engine", "hbs"); // calling handlebars in our project

// mysql-----------------------------------------------------------
// connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// connect to db
pool.getConnection((err, connection) => {
  if (err) throw err; // not comnected
  console.log(`connected ad ID ` + connection.threadId);
});

// Routes-----------------------------------------------------------
const routes = require("./server/routes/user");
app.use("/", routes);

// the express server to listen to this port------------------------
app.listen("2000", () => {
  console.log("Server is listening on 2000");
});
