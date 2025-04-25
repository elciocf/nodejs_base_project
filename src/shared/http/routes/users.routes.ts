import { Router } from "express";

const usersRoutes = Router();

usersRoutes.get("/list", (req, res) => {
    // Logic to list users
    res.send("List of users");
});

export { usersRoutes };
