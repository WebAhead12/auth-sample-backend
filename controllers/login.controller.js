const db = require("../database/connection")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = (req, res) => {
  const { username, password } = req.body

  db.query("SELECT * FROM users WHERE username = $1", [username])
    .then((results) => {
      //
      if (results.rows.length === 0) {
        return res.status(403).send({
          success: false,
          message: "username does not exist",
        })
      }
      //
      const user = results.rows[0]

      bcrypt.compare(password, user.password, (err, isCorrect) => {
        if (err || !isCorrect) {
          return res.status(403).send({
            success: false,
            message: "Incorrect password",
          })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

        res.status(200).send({
          success: true,
          token,
        })
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({ success: false })
    })
}
