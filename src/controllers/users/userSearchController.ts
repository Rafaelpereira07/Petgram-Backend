import { readData } from "../../utils/databaseManager";

export default async function userSearchController(req: any, res: any) {
  try {
    const { username } = req.query;

    if (!username) {
      return res
        .status(400)
        .json({ message: "O parâmetro 'username' é obrigatório para a busca." });
    }

    const users = await readData("users");

    const query = String(username).toLowerCase();
    const filtered = users.filter((user: any) => {
      return user.username.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      return res.status(404).json({ message: "Nenhum usuário encontrado." });
    }

    const sanitized = filtered.map(({ password, email, ...rest }: any) => rest);

    return res.status(200).json(sanitized);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
