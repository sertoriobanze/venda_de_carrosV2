import { Directory, File, Paths } from "expo-file-system";
import * as Crypto from "expo-crypto";

export async function saveImageLocally(uri: string): Promise<string> {
  // 1. Gera nome único com hash
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    uri + Date.now().toString()
  );
  const fileName = `${digest}.jpg`;

  // 2. Cria referência ao diretório `cars/`
  const carsDir = new Directory(Paths.document, "cars");

  // 3. Cria o diretório (idempotente)
  try {
    await carsDir.create({ idempotent: true });
  } catch (error) {
    console.log("Diretório já existe:", error);
  }

  // 4. Cria referência ao arquivo de origem (imagem temporária)
  const sourceFile = new File(uri);

  // 5. Cria referência ao destino final
  const destFile = new File(carsDir, fileName);

  // 6. COPIA o arquivo (nova API!)
  await sourceFile.copy(destFile);

  // 7. Retorna o caminho final
  return destFile.uri;
}

export function getAllCars(): Car[] {
  try {
    const rows = db.getAllSync('SELECT * FROM cars ORDER BY id DESC');
    return rows.map(row => ({
      id: row.id,
      brand: row.brand || '',
      model: row.model || '',
      year: row.year || 0,
      price: row.price != null ? Number(row.price) : 0,
      description: row.description || '',
      imagePath: row.imagePath || ''
    }));
  } catch (error) {
    console.error('Erro ao buscar carros:', error);
    return [];
  }
}