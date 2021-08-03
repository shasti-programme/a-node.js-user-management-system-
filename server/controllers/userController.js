const mysql = require("mysql");

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// View Users
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    // User the connection
    connection.query(
      'SELECT * FROM user WHERE status = "active"',
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          let removedUser = req.query.removed;
          res.render("home", { rows, removedUser });
        }
      }
    );
  });
};

exports.form = (req, res) => {
  console.log("red");
  res.render("add-user");
};

// Add new user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    // User the connection
    connection.query(
      "INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?",
      [first_name, last_name, email, phone, comments],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          res.render("add-user", { alert: "User added successfully." });
        }
      }
    );
  });
};

// Edit user
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    // User the connection
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          res.render("edit-user", { rows });
        }
      }
    );
  });
};

// Update User
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    // User the connection
    connection.query(
      "UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?",
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err; // not connected!
            console.log("Connected as ID " + connection.threadId);
            // User the connection
            connection.query(
              "SELECT * FROM user WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                // When done with the connection, release it
                connection.release();
                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: `${first_name} has been updated.`,
                  });
                }
              }
            );
          });
        }
      }
    );
  });
};

// Delete User
exports.delete = (req, res) => {
  // Delete a record
  pool.getConnection((err, connection) => {
    // User the connection
    connection.query(
      "DELETE FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          res.redirect("/");
        }
      }
    );
  });
};
