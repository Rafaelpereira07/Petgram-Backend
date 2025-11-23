
import { readData } from "../../utils/databaseManager";

async function getPhotoDetails(photo: any) {
    const users = await readData("users");
    const user = users.find((u: any) => u.id === photo.user_id);
    const username = user ? user.username : 'usuário-removido';

    return {
        id: photo.id,
        user_id: photo.user_id,
        username,
        image: photo.image,
        animal_name: photo.animal_name,
        animal_age: photo.animal_age,
        animal_weight: photo.animal_weight,
        comments: photo.comments,
        total_comments: photo.comments.length,
    };
}


export default async function photoGetController(req: any, res: any) {
  try {
    const { id } = req.params;
    const { _page = 1, _total = 6, _user } = req.query;

    let photos = await readData("photos");
    let filteredPhotos = photos;

    if (id) {
      const photo = photos.find((p: any) => p.id === Number(id));
      if (!photo) return res.status(404).json({ message: "Foto não encontrada." });
      const detailedPhoto = await getPhotoDetails(photo);
      return res.status(200).json(detailedPhoto);
    }

    if (_user) {
        filteredPhotos = filteredPhotos.filter((p: any) => p.user_id === _user);
    }

    const page = Number(_page);
    const total = Number(_total);
    const startIndex = (page - 1) * total;
    const paginatedPhotos = filteredPhotos.slice(startIndex, startIndex + total);


    const detailedPhotos = await Promise.all(paginatedPhotos.map(getPhotoDetails));

    return res.status(200).json(detailedPhotos.reverse());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
