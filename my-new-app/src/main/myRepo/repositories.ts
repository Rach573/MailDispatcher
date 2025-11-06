import mysql from "mysql2/promise";


export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mail_dispatcher",
  port: 3306
});
