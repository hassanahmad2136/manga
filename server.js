const sql = require('mssql');
let express = require('express');
let bodyParser = require('body-parser');//for post requests
let app = express();
const PORT = 3000;
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
// Create connection configuration object
const config = {
  user: 'has',
  password: 'hassan123',
  server: 'HASSAN',
  database: 'manga',
  options: {
    encrypt: true, // For security reasons, always use encrypted connections
    trustServerCertificate: true
  }
};

// Connect to database
app.get('/login', async (req, res) => {
  const { username, password, userType } = req.query;

  try {
    await sql.connect(config);

    var result;
    if(userType=='user')
    result = await sql.query`SELECT * FROM _user WHERE email = ${username} AND password = ${password}`;
    else
    result = await sql.query`SELECT * FROM admin WHERE email = ${username} AND password = ${password}`;
    if (result.recordset.length > 0) {
      res.json({ success: true, message: "success" });
    } else {
      res.json({ success: false, message: "username or password is incorrect" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false });
  } finally {
    sql.close();
  }
});

app.post('/signup', async (req, res) => {
  const { email, name, password } = req.body;

  await sql.connect(config);
  const query = `INSERT INTO _user (email, name, password) VALUES ('${email}', '${name}', '${password}')`;

  try {

    await sql.query(query);


    res.status(200).json({ message: 'User data inserted successfully' });
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {

    await sql.close();
  }
});
