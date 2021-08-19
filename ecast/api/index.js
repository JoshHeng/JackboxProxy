const axios = require('axios');

module.exports = async (req, res) => {
	const { path } = req.query;
	if (!path) return res.send('Invalid path');

	try {
		const res2 = await axios.get(`https://ecast.jackboxgames.com${path}`);
		return res.send(res2.data);
	}
	catch (error) {
		if (error.response) {
			return res.status(error.response.statusCode).send(error.response.data);
		}
		return res.status(500).send('Invalid');
	}
};