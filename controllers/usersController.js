import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*********************___Get All User Tickets___*************************/
export const getAllMyTickets = async (req, res) => {
    const { id } = req.params;
    console.log(id)
  // console.log(req.params)
  
  await pool
    .query(
  `
    SELECT t.id AS "ticket_id", t.subject, t.content, t.created_at, t.completed_at,
    s.status, s.color AS "status_color"
    FROM ticketit t
    JOIN users u
    ON u.id = t.user_id
    JOIN ticketit_status s
    ON t.status_id = s.id
    Where u.id = $1
    ORDER BY t.created_at DESC
  `,
      [id]
    )
    .then((result) => {
      if (result.rowCount == 0) {
        res.status(404).json("The user has no Tickets");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((error) =>  {res.status(500).json({ error: error.message })})
};


/*********************___Create a New Ticket from User___*************************/
export const createNewTicket = async (req, res) => {
  const { id } = req.params;
  const { subject, content, category } = req.body;
  const status_id = 1;//Standard is ticket OPEN
  const created_at = 'now()';
  let category_id; //From category table


  await pool.query(
    `
    SELECT id FROM ticketit_category
    WHERE name = $1
    `,[category]
  )
  .then((category) => {
    category_id = category.rows[0].id
    pool.query(
      `
        INSERT INTO ticketit
        (subject, content,status_id, user_id,category_id, created_at)
        VALUES
        ($1, $2, $3, $4, $5, $6) RETURNING *;
      `,
      [subject, content, status_id, id, category_id,created_at]
    )
    .then((ticket) =>{
        res.status(201).json(ticket)
    })
    .catch((error) => res.status(500).json({error: error.message}))

  })
  .catch((error) => res.status(500).json({error: error.message}))

  console.log(category_id)
}


export const getMyInfos = async (req, res) => {
  const { user_id } = req.params;

  await pool.query(
    `
    SELECT first_name, last_name, username, email FROM users WHERE id =$1;
    `, [user_id]
  )
  .then((result) => {
    if (result.rowCount == 0) {
      res.status(404).json("Something went wrong");
    } else {
      res.status(200).json(result);
    }
  })
  .catch((error) =>  {res.status(500).json({ error: error.message })})
}

/*********************___User Edite his Password___*************************/
export const editeMyPassword = async (req, res) => {
  const { currentPassword, newPassword, username} = req.body;
  let storedPassword;
  const hashedPassword = await bcrypt.hash(newPassword, 10); // password hashing

   await pool.query(
    `
    SELECT password FROM users WHERE username = $1;
    `, [username]
  )
  .then((result) => {storedPassword = result.rows[0].password})
  .catch((err) => res.status(500).json({ err: err.message }))

  console.log(`storedPAssword: ${storedPassword}`)
  //Compare the given password with the stored user's password
 const isPasswordCorrect   = await bcrypt.compare(currentPassword, storedPassword)
 console.log(`currentPassword: ${currentPassword}`)
 if (!isPasswordCorrect) {
  console.log("password not match");
  res.status(400).send("Invalid username Or password");

} else {
  console.log("password match");
 
  console.log(`hashedPassword ${hashedPassword}`)
 
  pool.query(
    `
      UPDATE users SET password = $1 WHERE username = $2 RETURNING *;
    `, [hashedPassword, username]
  )
  res.status(201).json("Password successfully updated")
} 
   
  
}


/*********************___Verify Session___*************************/
export const verifySession = (req, res) => {
  res.status(200).send("Token successfully verified");
};