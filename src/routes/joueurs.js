import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/joueurs
// Paramètres optionnels : ?equipe= &position=
router.get("/", async (req, res, next) => {
  try {
    const { equipe, position } = req.query;
    const where = {};
    if (equipe)   where.equipe    = { contains: equipe,   mode: "insensitive" };
    if (position) where.position  = { contains: position, mode: "insensitive" };

    const joueurs = await prisma.joueur.findMany({ where, orderBy: { nom: "asc" } });
    res.json({ data: joueurs, total: joueurs.length });
  } catch (err) { next(err); }
});

// GET /api/joueurs/:idOrNom
// Accepte un ID entier OU un nom (recherche partielle)
router.get("/:idOrNom", async (req, res, next) => {
  try {
    const param = req.params.idOrNom;
    const isId  = /^\d+$/.test(param);

    if (isId) {
      // Recherche par ID
      const joueur = await prisma.joueur.findUnique({
        where: { id: parseInt(param) },
      });
      if (!joueur) return res.status(404).json({ error: "Joueur introuvable" });
      return res.json({ data: joueur });
    }

    // Recherche par nom (partielle, insensible à la casse)
    const joueurs = await prisma.joueur.findMany({
      where: { nom: { contains: param, mode: "insensitive" } },
      orderBy: { nom: "asc" },
    });

    if (joueurs.length === 0) {
      return res.status(404).json({ error: `Aucun joueur trouvé pour "${param}"` });
    }
    if (joueurs.length === 1) {
      return res.json({ data: joueurs[0] });
    }
    return res.json({ data: joueurs, total: joueurs.length });

  } catch (err) { next(err); }
});

export default router;
