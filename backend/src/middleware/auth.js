import dotenv from "dotenv";
dotenv.config();

export function verifyAdmin(req, res, next) {
    const adminKey = process.env.ADMIN_KEY;
    const headerKey = req.headers["x-admin-key"];

    if (!headerKey || headerKey !== adminKey) {
        return res.status(403).json({ error: "Forbidden: Admin access only" });
    }

    next();
}
