import fs from "fs/promises";

const databasePath = "db.json";

export async function readData(entity: string) {
  const data = await fs.readFile(databasePath);
  const dataParse = JSON.parse(data.toString());

  if (!dataParse[entity]) {
    throw new Error("entity not found.");
  }

  return dataParse[entity];
}

export async function writeData(entity: string, saveData: any) {
  const data = await fs.readFile(databasePath);
  const dataParse = JSON.parse(data.toString());

  if (!dataParse[entity]) {
    throw new Error("entity not found.");
  }

  dataParse[entity].push(saveData);

  await fs.writeFile(databasePath, JSON.stringify(dataParse, null, "\t"));
}

export async function getNextId(entity: string) {
  const data = await readData(entity);
  if (data.length === 0) return 1;
  const maxId = Math.max(...data.map((item: any) => item.id));
  return maxId + 1;
}

export async function writeDataBulk(entity: string, saveData: any[]) {
  const data = await fs.readFile(databasePath);
  const dataParse = JSON.parse(data.toString());

  if (!dataParse[entity]) {
    throw new Error("entity not found.");
  }

  dataParse[entity] = saveData;

  await fs.writeFile(databasePath, JSON.stringify(dataParse, null, "\t"));
}
