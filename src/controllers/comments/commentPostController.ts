import { readData, writeDataBulk } from "../../utils/databaseManager";
import { verifyToken } from "../../utils/jwtManager";
import { v4 as uuidv4 } from "uuid";

export default async function commentPostController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const photo_id = Number(req.params.id);
    const { comment } = req.body;

    // Validação
    if (!photo_id || !comment) {
      return res.status(400).json({ message: "Dados incompletos (ID da foto ou conteúdo)." });
    }

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);

    const photos = await readData("photos");
    const photoIndex = photos.findIndex((p: any) => p.id === photo_id);

    if (photoIndex === -1) {
      return res.status(404).json({ message: "Foto não encontrada." });
    }

    const newComment = {
      comment_id: uuidv4(),
      comment_user_id: decoded.id,
      username: decoded.username,
      content: comment,
    };

    photos[photoIndex].comments.push(newComment);
    await writeDataBulk("photos", photos);

    return res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor ao comentar." });
  }
}
