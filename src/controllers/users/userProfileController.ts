import { readData } from "../../utils/databaseManager";

async function getPhotoDetails(photo: any) {
    const users = await readData("users");
    const user = users.find((u: any) => u.id === photo.user_id);
    const username = user ? user.username : 'usuário-removido';

    return {
        id: photo.id,
        image: photo.image,
    };
}

export default async function userProfileController(req: any, res: any) {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ message: "Username não fornecido na rota." });
        }

        const users = await readData("users");

        const targetUser = users.find((u: any) =>
            u.username.toLowerCase() === username.toLowerCase()
        );

        if (!targetUser) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        const photos = await readData("photos");

        const userPhotos = photos.filter((p: any) => p.user_id === targetUser.id);

        const formattedPhotos = await Promise.all(userPhotos.map(getPhotoDetails));

        const response = {
            username: targetUser.username,
            photos: formattedPhotos.reverse(),
        };

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno ao buscar perfil do usuário." });
    }
}
