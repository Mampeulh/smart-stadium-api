import "dotenv/config";
import express from "express";
import cors    from "cors";
import morgan  from "morgan";

import joueurRoutes    from "./routes/joueurs.js";
import matchRoutes     from "./routes/matchs.js";
import nourritureRoutes from "./routes/nourriture.js";
import billetRoutes    from "./routes/billets.js";

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ── Health check ─────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🏟️ Smart Stadium API — opérationnelle",
    version: "1.0.0",
    docs: "https://github.com/votre-repo#readme",
    endpoints: {
      "GET  /api/joueurs":                       "Liste des joueurs",
      "GET  /api/joueurs/:id":                   "Profil d'un joueur",
      "GET  /api/matchs":                        "Liste des matchs",
      "GET  /api/matchs/:id/score":              "Score d'un match",
      "GET  /api/nourriture/menu":               "Menu du stade",
      "POST /api/nourriture/commander":          "Commander de la nourriture",
      "GET  /api/nourriture/commandes/:id":      "Suivi d'une commande",
      "GET  /api/billets/disponibilites/:matchId": "Places disponibles",
      "POST /api/billets/reserver":              "Réserver un billet",
      "GET  /api/billets/:id":                   "Détail d'un billet",
    },
  });
});

// ── Routes ───────────────────────────────────
app.use("/api/joueurs",    joueurRoutes);
app.use("/api/matchs",     matchRoutes);
app.use("/api/nourriture", nourritureRoutes);
app.use("/api/billets",    billetRoutes);

// ── 404 ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

// ── Error handler ─────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production"
      ? "Erreur interne du serveur"
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});

export default app;
