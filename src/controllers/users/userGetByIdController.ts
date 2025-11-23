import { readData } from "../../utils/databaseManager";

export default async function userGetByIdController(req: any, res: any) {
  try {
    const { id } = req.params;
    const users = await readData("users");
    const user = users.find((u: any) => u.id === id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const publicUserData = {
      id: user.id,
      username: user.username,
    };

    return res.status(200).json(publicUserData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
