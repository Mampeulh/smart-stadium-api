import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/matchs
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

// GET /api/matchs/:id/score
router.get("/:id/score", async (req, res, next) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!match) return res.status(404).json({ error: "Match introuvable" });

    if (match.statut === "à venir") {
      return res.json({
        data: { ...match, score: null, message: "Ce match n'a pas encore commencé" },
      });
    }

    res.json({
      data: {
        ...match,
        score: { domicile: match.scoreDom, exterieur: match.scoreExt },
      },
    });
  } catch (err) { next(err); }
});

export default router;
