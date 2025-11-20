// controllers/photoCreateController.ts

import { getNextId, writeData } from "../../utils/databaseManager";
import { verifyToken } from "../../utils/jwtManager";

export default async function photoCreateController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const { image, dog_name, dog_age, dog_weight } = req.body;

    if (!image || !dog_name || !dog_age || !dog_weight) {
      return res.status(400).json({ message: "Todos os campos da foto são obrigatórios." });
    }

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token); // Contém id e username do usuário logado

    const newPhoto = {
      id: await getNextId("photos"),
      user_id: decoded.id,
      image,
      dog_name,
      dog_age: Number(dog_age),
      dog_weight: Number(dog_weight),
      comments: [], // Inicia com array de comentários vazio
    };

    await writeData("photos", newPhoto);
    return res.status(201).json(newPhoto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor ao criar foto." });
  }
}
