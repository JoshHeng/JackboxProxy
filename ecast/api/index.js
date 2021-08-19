const axios = require('axios');

module.exports = (req, res) => {
	const { path } = req.query;
	if (!path) res.send('Invalid path');

	const res = await axios.get(`https://ecast.jackboxgames.com${path}`).then(({data}) => data);
	res.send({
		...res
	});
};