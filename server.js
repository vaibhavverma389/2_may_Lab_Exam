const express = require("express");
const fs = require("fs");
const app = express();
const port = 4000;


app.use(express.json());

const file = "./data.json"; 


if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([]));
}


const readData = () => {
    try {
        const data = fs.readFileSync(file, "utf-8");
        return JSON.parse(data || "[]");
    } catch (err) {
        return [];
    }
};


const writeData = (data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

app.post("/users", (req, res) => {

    if (!req.body || !req.body.name || !req.body.email) {
        return res.status(400).json({
            message: "Name and Email are required"
        });
    }

    const users = readData();

    const newUser = {
        id: Date.now(),
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        mobile: req.body.mobile,
        city: req.body.city,
    };

    users.push(newUser);
    writeData(users);

    res.json({ message: "User created", user: newUser });
});

app.get("/users", (req, res) => {
    const users = readData();
    res.json(users);
});

app.get("/users/:id", (req, res) => {
    const users = readData();
    const user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});


app.put("/users/:id", (req, res) => {
    const users = readData();
    const userIndex = users.findIndex(u => u.id == req.params.id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = { ...users[userIndex], 
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        mobile: req.body.mobile,
        city: req.body.city };
    users[userIndex] = updatedUser;
    writeData(users);

    res.json({ message: "User updated", user: updatedUser });
});

app.delete("/users/:id", (req, res) => {
    const users = readData();
    const userIndex = users.findIndex(u => u.id == req.params.id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    users.splice(userIndex, 1);
    writeData(users);

    res.json({ message: "User deleted" });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});