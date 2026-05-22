const seller = (req, res, next) => {
    if (req.user && (req.user.isSeller || req.user.isAdmin)) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as a seller');
    }
};

module.exports = { seller };
