const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'iLikeKitsuneX10!',
  database: 'employees'
});

connection.connect(function (err) {
  if (err) console.info(err);
})

module.exports = connection