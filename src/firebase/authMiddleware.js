const admin = require('./firebaseAdmin');

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};

module.exports = authenticateToken;
