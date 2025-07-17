// api/geocode.js
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejar preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Parámetro "q" requerido' });
    }

    console.log("🔍 Buscando:", q);

    const queries = [
      `${q}, Monterrey, Nuevo León, México`,
      `${q}, Área Metropolitana de Monterrey, México`,
      `${q}, Nuevo León, México`,
    ];

    let mejoresResultados = [];

    for (const query of queries) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=mx&limit=10&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "HazPlan-App/1.0",
        },
      });

      if (!response.ok) continue;

      const data = await response.json();

      if (data.length > 0) {
        const resultadosValidos = data.filter((result) => {
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          const enArea =
            lat >= 25.3 && lat <= 26.0 && lon >= -100.8 && lon <= -99.8;

          const esMty =
            result.display_name &&
            (result.display_name.includes("Monterrey") ||
              result.display_name.includes("San Pedro") ||
              result.display_name.includes("Santa Catarina") ||
              result.display_name.includes("García") ||
              result.display_name.includes("Escobedo") ||
              result.display_name.includes("Guadalupe") ||
              result.display_name.includes("Apodaca") ||
              result.display_name.includes("Nuevo León"));

          return enArea && esMty;
        });

        if (resultadosValidos.length > 0) {
          mejoresResultados = resultadosValidos;
          break;
        }
      }
    }

    const resultados = mejoresResultados.map((result) => ({
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      display_name: result.display_name,
      address: result.address,
    }));

    console.log(`✅ Enviando ${resultados.length} resultados`);

    return res.status(200).json(resultados);
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
