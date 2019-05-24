const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '12347',
			username: 'danielbuhaianu',
			email: 'test@gmail.com',
			password: 'test',
			entries: 0,
			joined: new Date()
		},
		{
			id: '9836',
			username: 'marianfinaru',
			email: 'MarianFinaru@gmail.com',
			password: 'bananas2',
			entries: 0,
			joined: new Date()
		},
		{
			id: '3589',
			username: 'bejaneduard',
			email: 'bejanEduard@gmail.com',
			password: 'mandarine-portocale',
			entries: 0,
			joined: new Date()
		},
	]
};

app.get('/', (req, res) => {
	res.send(database.users);
})

app.get('/profile/:id', (req, res) => {
	const  { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			return res.json(user);
		}
	});
	if(!found){
		res.status(404).json('no such user');
	}
})

app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	const filteredDatabase = database.users.filter(user => {
		return user.email.toLowerCase() === email.toLowerCase() &&
			   user.password === password
	});
	if(filteredDatabase.length > 0){
		res.json(filteredDatabase[0]);
	}
	else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const { username, email, password } = req.body;
	database.users.push({
		id: '122323',
		username: username,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length - 1]);
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			user.entries++;
			res.json(user.entries);
		}
	});
	if(!found){
		res.status(404).json('error. user not found');
	}
})

app.listen(8080, () => {
	console.log('app is running on port 8080');
})