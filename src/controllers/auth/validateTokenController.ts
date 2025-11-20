import { readData } from "../../utils/databaseManager";
import { verifyToken } from "../../utils/jwtManager";

export default async function validateTokenController(req: any, res: any) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);

    const users = await readData("users");
    const user = users.find((u: any) => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const { password, ...userWithoutPassword } = user;

    return res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "invalid token" });
  }
}
