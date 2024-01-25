
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("userdata.db");

const axios = require('axios');
//ping png api
axios.get(`https://tulu-png-api.glitch.me/`)



//create userdata table if not exists
db.run(`CREATE TABLE IF NOT EXISTS userdata (
  userid INTEGER UNIQUE,
  color STRING DEFAULT 'red',
  font STRING DEFAULT 'baravu',
  format STRING DEFAULT 'png'
)`);
async function dbupdate(userid, key, values) {
    if (key.length !== values.length) { console.log("key values length difference error"); return }
    dbcreate(userid);
    let sqlQuery = ""
    for (let i = 0; i < key.length; i++) {
      sqlQuery += `${key[i]}="${values[i]}",`
    }
    sqlQuery = sqlQuery.slice(0, -1);
    db.run(`UPDATE userdata SET ${sqlQuery} WHERE userid = ${userid}`, (err) => { if (err) console.log(err) })
  }
  
  function dbget(userid, callback) {
    db.get(`SELECT * FROM userdata WHERE userid = ${userid}`, (err, row) => {
      if (row) callback(row)
      else callback(null)
    })
    return
  }
  function dbcreate(userid) {
    db.run(`INSERT INTO userdata(userid) SELECT ${userid} WHERE NOT EXISTS (SELECT * FROM userdata WHERE userid=${userid})`, (err) => { if (err) console.log(err) })
  }
  async function dbdelete(userid) {
    db.run(`DELETE FROM userdata WHERE userid=${userid}`, (err) => { if (err) console.log(err) })
    return
  }

  exports.dbcreate = dbcreate;
  exports.dbdelete = dbdelete;
  exports.dbget = dbget;
  exports.dbupdate = dbupdate;