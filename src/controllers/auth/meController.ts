import { readData } from "../../utils/databaseManager";

export default async function meController(req: any, res: any) {
  try {
    const userId = req.userId;

    const users = await readData("users");
    const user = users.find((u: any) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const response = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
