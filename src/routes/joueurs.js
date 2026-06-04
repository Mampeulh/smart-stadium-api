import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/joueurs
router.get("/", async (req, res, next) => {
  try {
    const { equipe, position } = req.query;
    const where = {};
    if (equipe)    where.equipe    = { contains: equipe,    mode: "insensitive" };
    if (position)  where.position  = { contains: position,  mode: "insensitive" };

    const joueurs = await prisma.joueur.findMany({ where, orderBy: { nom: "asc" } });
    res.json({ data: joueurs, total: joueurs.length });
  } catch (err) { next(err); }
});

// GET /api/joueurs/:id
router.get("/:id", async (req, res, next) => {
  try {
    const joueur = await prisma.joueur.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!joueur) return res.status(404).json({ error: "Joueur introuvable" });
    res.json({ data: joueur });
  } catch (err) { next(err); }
});

export default router;
