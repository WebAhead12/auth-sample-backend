const db = require("../database/connection")

module.exports = (req, res) => {
  db.query("SELECT email, username FROM users")
    .then((results) => {
      //
      res.status(200).send({
        success: true,
        users: results.rows,
      })
    })
    .catch(() => {
      res.status(500).send({ success: false })
    })
}
