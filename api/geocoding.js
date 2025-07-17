// Esta API ha sido deshabilitada. No disponible.
export default function handler(req, res) {
  return res
    .status(410)
    .json({ error: "La API de geocodificación ha sido deshabilitada." });
}
