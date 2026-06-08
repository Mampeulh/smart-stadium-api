import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ── Helper : formater un match avec son score ──
function formatMatch(m) {
  return {
    id:          m.id,
    domicile:    m.domicile,
    exterieur:   m.exterieur,
    competition: m.competition,
    date:        m.date,
    stade:       m.stade,
    statut:      m.statut,
    score: m.statut !== "à venir"
      ? { domicile: m.scoreDom, exterieur: m.scoreExt }
      : null,
    ...(m.statut === "à venir" && { message: "Ce match n'a pas encore commencé" }),
  };
}

// GET /api/matchs
// Paramètres optionnels : ?statut= &competition=
router.get("/", async (req, res, next) => {
  try {
    const { statut, competition } = req.query;
    const where = {};
    if (statut)      where.statut      = statut;
    if (competition) where.competition = { contains: competition, mode: "insensitive" };

    const matchs = await prisma.match.findMany({ where, orderBy: { date: "desc" } });
    res.json({ data: matchs, total: matchs.length });
  } catch (err) { next(err); }
});

// GET /api/matchs/search/score
// Recherche par domicile, exterieur et/ou competition
// ⚠️ Doit être AVANT /:matchId/score
router.get("/search/score", async (req, res, next) => {
  try {
    const { domicile, exterieur, competition } = req.query;

    if (!domicile && !exterieur && !competition) {
      return res.status(400).json({
        error: "Au moins un filtre requis : domicile, exterieur ou competition",
      });
    }

    const where = {};
    if (domicile)    where.domicile    = { contains: domicile,    mode: "insensitive" };
    if (exterieur)   where.exterieur   = { contains: exterieur,   mode: "insensitive" };
    if (competition) where.competition = { contains: competition, mode: "insensitive" };

    const matchs = await prisma.match.findMany({ where, orderBy: { date: "desc" } });

    if (matchs.length === 0) {
      return res.status(404).json({ error: "Aucun match trouvé" });
    }

    const data = matchs.map(formatMatch);
    res.json({
      data:  data.length === 1 ? data[0] : data,
      total: data.length,
    });
  } catch (err) { next(err); }
});

// GET /api/matchs/:matchId/score
// Recherche par ID
router.get("/:matchId/score", async (req, res, next) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: parseInt(req.params.matchId) },
    });

    if (!match) return res.status(404).json({ error: "Match introuvable" });

    res.json({ data: formatMatch(match) });
  } catch (err) { next(err); }
});

export default router;
