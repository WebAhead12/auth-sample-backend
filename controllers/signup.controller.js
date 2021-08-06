const db = require("../database/connection")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = (req, res) => {
  const { email, username, password, confirmPassword } = req.body

  if (!email || !username || !password || !confirmPassword) {
    return res.status(200).send({
      success: false,
      message: "Missing data",
    })
  }

  if (password !== confirmPassword) {
    return res.status(200).send({
      success: false,
      message: "Passwords don't match",
    })
  }

  db.query("SELECT * FROM users WHERE email = $1 OR username = $2", [
    email,
    username,
  ])
    .then((results) => {
      if (results.rows.length > 0) {
        return res.status(200).send({
          success: false,
          message: "Email or username already exists",
        })
      }
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          throw new Error(err)
        }

        // hash: 2a.asd,2e/.asdwasdnaskdnasd.asldnalsdnalksnd

        db.query(
          `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)
            RETURNING id`,
          [username, email, hash]
        ).then((result) => {
          // result.rows[0].id -> the id for the new user
          const token = jwt.sign(
            { id: result.rows[0].id },
            process.env.JWT_SECRET
          )

          res.status(200).send({
            success: true,
            token,
          })
        })
      })
    })
    .catch((err) => {
      res.status(200).send({
        success: false,
        message: "Something went wrong",
      })
    })
}
