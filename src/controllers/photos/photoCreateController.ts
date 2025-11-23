import { getNextId, writeData } from "../../utils/databaseManager";
import { verifyToken } from "../../utils/jwtManager";

export default async function photoCreateController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const { image, animal_name, animal_age, animal_weight } = req.body;

    if (!image || !animal_name || !animal_age || !animal_weight) {
      return res.status(400).json({ message: "Todos os campos da foto são obrigatórios." });
    }

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);

    const newPhoto = {
      id: await getNextId("photos"),
      user_id: decoded.id,
      image,
      animal_name,
      animal_age: Number(animal_age),
      animal_weight: Number(animal_weight),
      comments: [], 
    };

    await writeData("photos", newPhoto);
    return res.status(201).json(newPhoto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor ao criar foto." });
  }
}
