// controllers/photoGetController.ts

import { readData } from "../../utils/databaseManager";

// Função auxiliar para sanitizar e adicionar info do username
async function getPhotoDetails(photo: any) {
    const users = await readData("users");
    const user = users.find((u: any) => u.id === photo.user_id);
    const username = user ? user.username : 'usuário-removido';

    return {
        id: photo.id,
        user_id: photo.user_id,
        username,
        image: photo.image,
        dog_name: photo.dog_name,
        dog_age: photo.dog_age,
        dog_weight: photo.dog_weight,
        comments: photo.comments,
        total_comments: photo.comments.length,
    };
}

// controllers/photoGetController.ts (AJUSTADO PARA QUERY DO FRONTEND)

// ... (imports e getPhotoDetails permanecem iguais)

export default async function photoGetController(req: any, res: any) {
  try {
    const { id } = req.params;
    // Parâmetros do seu frontend: _page, _total, _user
    const { _page = 1, _total = 6, _user } = req.query;

    let photos = await readData("photos");
    let filteredPhotos = photos;

    // ... (Lógica de busca por ID e busca por q removida, se não for necessária) ...

    // 1. Filtrar por ID (PHOTO_GET / PHOTOM_GET)
    if (id) {
      const photo = photos.find((p: any) => p.id === Number(id));
      if (!photo) return res.status(404).json({ message: "Foto não encontrada." });
      const detailedPhoto = await getPhotoDetails(photo);
      return res.status(200).json(detailedPhoto);
    }

    // 2. Filtrar por user (PHOTOS_GET - _user)
    if (_user) {
        filteredPhotos = filteredPhotos.filter((p: any) => p.user_id === _user);
    }

    // 3. Paginação (PHOTOS_GET - _page, _total)
    const page = Number(_page);
    const total = Number(_total);
    const startIndex = (page - 1) * total;
    const paginatedPhotos = filteredPhotos.slice(startIndex, startIndex + total);


    // 4. Formata e retorna
    const detailedPhotos = await Promise.all(paginatedPhotos.map(getPhotoDetails));

    return res.status(200).json(detailedPhotos.reverse());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
