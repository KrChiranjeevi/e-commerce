const protectSeller = (req, res, next) => {
    console.log('protectSeller middleware debug:');
    if (req.user) {
        console.log(`User ID: ${req.user._id}, isSeller: ${req.user.isSeller}`);
    } else {
        console.log('req.user is undefined');
    }

    if (req.user && req.user.isSeller) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as a seller');
    }
};

module.exports = { protectSeller };
