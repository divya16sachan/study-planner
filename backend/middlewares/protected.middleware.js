export const protectedRoute = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}