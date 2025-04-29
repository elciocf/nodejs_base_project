import { Router } from "express";

const usersRoutes = Router();

usersRoutes.post("/list", (req, res) => {
    // Simulate a database call
    const users = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
    ];

    return res.status(200).json(users);
});

export { usersRoutes };
