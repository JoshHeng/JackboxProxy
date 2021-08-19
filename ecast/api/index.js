const request = require('request');

module.exports = (req, res) => {
	const { path } = req.query;
	if (!path) res.send('Invalid path');
	request(`https://ecast.jackboxgames.com${path}`).pipe(res);
};