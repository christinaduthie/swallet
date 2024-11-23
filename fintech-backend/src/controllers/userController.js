const getUsers = (req, res) => {
    res.status(200).json({ message: 'User route working!' });
};

module.exports = { getUsers };
