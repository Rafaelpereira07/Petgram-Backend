import { readData, writeData } from "../../utils/databaseManager";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export default async function registerController(req: any, res: any) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(406).json({
      message: "Dados incompletos.",
    });
  }

  const users = await readData("users");

  const exists = users.find((user: any) => user.email === email || user.username === username);

  if (exists) {
    return res.status(403).json({
      message: "Email ou Username já cadastrado.",
    });
  }

  const hashPassword = await bcrypt.hash(password, 8);

  const newUser = {
    id: uuidv4(),
    username,
    email,
    password: hashPassword,
  };

  await writeData("users", newUser);

  return res.status(201).json({ id: newUser.id, username: newUser.username });
}
