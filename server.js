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
		host: 'postgresql-amorphous-79547'
		user: 'postgres',
		password: 'admin',
		database: 'smart-brain'
	}
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send(`it is working!`) });

app.get('/db', (req, res) => {
	return db.select('*').from('test_table')
	.then(data => {
		res.json(data)
	})
	.catch(err => {
		res.status(400).json(`can't get data`)
	})
})

app.get('/profile/:id', profile.handleProfile(db));

app.post('/signin', signin.handleSignIn(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));

app.put('/image', image.handleImage(db));
app.post('/imageurl', image.handleApiCall());

app.listen(process.env.PORT || 3000, () => {
 console.log(`app is running on port ${process.env.PORT}`); 
});