import express from "express";
import jsonServer from "json-server";
import { authMiddleware } from "./middlewares/authMiddleware";

// --- Controladores de Autenticação e Usuário ---
import loginController from "./controllers/auth/loginController"; // POST /token
import meController from "./controllers/auth/meController"; // GET /user
import registerController from "./controllers/auth/registerController"; // POST /user
import validateTokenController from "./controllers/auth/validateTokenController"; // POST /token/validate

// --- Controladores de Rede Social (Fotos e Comentários) ---
import commentPostController from "./controllers/comments/commentPostController"; // POST /comment/:id
import photoCreateController from "./controllers/photos/photoCreateController"; // POST /photo
import photoDeleteController from "./controllers/photos/photoDeleteController"; // DELETE /photo/:id
import photoGetController from "./controllers/photos/photoGetController"; // GET /photo/
import userProfileController from "./controllers/users/userProfileController";

const databasePath = "db.json";
const server = jsonServer.create();
const router = jsonServer.router(databasePath);

server.use(jsonServer.defaults());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// --- 1. ROTAS PÚBLICAS E DE AUTENTICAÇÃO ---

// Login JWT (TOKEN_POST)
server.post("/token", loginController);

// Validação de Token (TOKEN_VALIDATE_POST)
server.post("/token/validate", validateTokenController);

// Registro de Usuário (USER_POST)
server.post("/user", registerController);

// --- 2. ROTAS PÚBLICAS (GET) ---

// Busca/Listagem de Fotos (PHOTO_GET, PHOTOS_GET, PROFILE_PHOTOS_GET)
server.get("/photo/:id", photoGetController);
server.get("/photo", photoGetController);
server.get("/profile/:username", userProfileController)

// --- 3. MURO DE AUTENTICAÇÃO ---
server.use(authMiddleware);

// --- 4. ROTAS PROTEGIDAS ---

// Perfil do Usuário Logado (USER_GET)
server.get("/user", meController);

// Postar Foto (PHOTO_POST)
server.post("/photo", photoCreateController);

// Deletar Foto (PHOTO_DELETE)
server.delete("/photo/:id", photoDeleteController);

// Postar Comentário (COMMENT_POST)
server.post("/comment/:id", commentPostController);

server.use(router);

server.listen(3000, () => {
  console.log("API running on port 3000!");
});
