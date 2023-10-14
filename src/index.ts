import * as dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import prisma from "../lib/prisma";

dotenv.config()

const app: Application = express();
app.use(cors({ origin: true }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Healthy");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  console.log(process.env.SECRET_CODE);
});

// Get all users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Get a user by id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
  res.json(user);
});

// Create a new user
app.post("/users", async (req, res) => {
  const { email, firstName, lastName } = req.body;
  const newUser = await prisma.user.create({
    data: { email, firstName, lastName },
  });
  res.status(201).json(newUser);
});

// Update a user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { email, firstName, lastName } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { email, firstName, lastName },
  });
  res.json(updatedUser);
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const deletedUser = await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  res.json(deletedUser);
});
