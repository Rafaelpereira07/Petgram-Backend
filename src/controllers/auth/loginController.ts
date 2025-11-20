import bcrypt from "bcrypt";
import { readData } from "../../utils/databaseManager";
import { createToken } from "../../utils/jwtManager";

export default async function loginController(req: any, res: any) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "login and password is required.",
    });
  }

  const users = await readData("users");

  const userExists = users.find((user: any) => user.username === username);

  if (!userExists) {
    return res.status(403).json({
      message: "invalid login or password.",
    });
  }

  const isValidPassword = await bcrypt.compare(password, userExists.password);

  if (!isValidPassword) {
    return res.status(403).json({
      message: "invalid login or password.",
    });
  }

  const token = createToken({ id: userExists.id, username: userExists.username });

  const loggedUser = {
    token,
    user_display_name: userExists.display_name,
    user_nicename: userExists.username,
    user_email: userExists.email,
  };

  return res.status(200).json(loggedUser);
}
