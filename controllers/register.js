const saltRounds = 10;

const handleRegister = (db, bcrypt) => (req, res) => {
	const { username, email, password } = req.body;
	
	if(!email || !password || !username){
		return res.status(400).json('incorrect form submission');
	}

	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);
	
	db.transaction(trx => {
		return trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				username: username,
				email: loginEmail[0],
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'))
};

module.exports = {
	handleRegister
}