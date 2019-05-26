const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image =  require('./controllers/image');

const db = knex({
	client: 'pg',
	connection: {
		connectionSring: `${process.env.DATABASE_URL}`,
		ssl: true,
	}
});

// <----- Testing if database is connected

const { Client } = require('pg');

const client = new Client({
	connectionSring: `${process.env.DATABASE_URL}`,
	ssl: true,
});

client.connect();

client.query('SELECT * FROM test_table;', (err, res) => {
	if(err) throw err;
	for(let row of res.rows) {
		console.log(JSON.stringify(row));
	}
	client.end();
});

// ------> End of Testing

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send(`it is working!`) });
// app.get('/db', async (req,res) => {
// 	try {
// 		const client = await pool.connect()
// 		const result = await client.query('SELECT * FROM test_table');
// 		const results ={ 'results': (result) ? result.rows : null };
// 		res.render('pages/db', results);
// 		client.release();
// 	}
// 	catch (err) {
// 		console.error(err);
// 		res.send("Error " + err);
// 	}
// });

app.get('/profile/:id', profile.handleProfile(db));

app.post('/signin', signin.handleSignIn(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));

app.put('/image', image.handleImage(db));
app.post('/imageurl', image.handleApiCall());

app.listen(process.env.PORT || 3000, () => {
 console.log(`app is running on port ${process.env.PORT}`); 
});