import { readData, writeDataBulk } from "../../utils/databaseManager";
import { verifyToken } from "../../utils/jwtManager";

export default async function photoDeleteController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const { id } = req.params;
    const photoId = Number(id);

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);

    const photos = await readData("photos");
    const photoIndex = photos.findIndex((p: any) => p.id === photoId);

    if (photoIndex === -1) {
      return res.status(404).json({ message: "Foto não encontrada." });
    }

    const photo = photos[photoIndex];

    if (photo.user_id !== decoded.id) {
      return res.status(403).json({ message: "Não autorizado a deletar esta foto." });
    }

    photos.splice(photoIndex, 1);

    await writeDataBulk("photos", photos);

    return res.status(200).json({ message: "Foto deletada com sucesso." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
