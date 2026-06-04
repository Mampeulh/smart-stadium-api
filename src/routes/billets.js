import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const PRIX      = { tribune: 35, vip: 120, pelouse: 250 };
const CAPACITES = { tribune: 500, vip: 50, pelouse: 20 };

// GET /api/billets/disponibilites/:matchId
router.get("/disponibilites/:matchId", async (req, res, next) => {
  try {
    const matchId = parseInt(req.params.matchId);
    const match   = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) return res.status(404).json({ error: "Match introuvable" });

    const disponibilites = await Promise.all(
      Object.keys(PRIX).map(async (cat) => {
        const reserved = await prisma.billet.aggregate({
          where: { matchId, categorie: cat },
          _sum: { quantite: true },
        });
        return {
          categorie:      cat,
          placesRestantes: CAPACITES[cat] - (reserved._sum.quantite || 0),
          prix:           PRIX[cat],
        };
      })
    );

    res.json({
      data: {
        match: { id: match.id, domicile: match.domicile, exterieur: match.exterieur, date: match.date, stade: match.stade },
        disponibilites,
      },
    });
  } catch (err) { next(err); }
});

// POST /api/billets/reserver
router.post("/reserver", async (req, res, next) => {
  try {
    const { matchId, categorie, nomAcheteur, email, quantite = 1 } = req.body;

    if (!matchId || !categorie || !nomAcheteur || !email) {
      return res.status(400).json({ error: "Champs requis : matchId, categorie, nomAcheteur, email" });
    }
    if (!["tribune", "vip", "pelouse"].includes(categorie)) {
      return res.status(400).json({ error: "Catégorie invalide : tribune | vip | pelouse" });
    }

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match)                      return res.status(404).json({ error: "Match introuvable" });
    if (match.statut === "terminé")  return res.status(409).json({ error: "Ce match est terminé, réservation impossible" });

    const reserved = await prisma.billet.aggregate({
      where: { matchId, categorie },
      _sum: { quantite: true },
    });
    if ((CAPACITES[categorie] - (reserved._sum.quantite || 0)) < quantite) {
      return res.status(409).json({ error: `Plus assez de places en catégorie "${categorie}"` });
    }

    const billet = await prisma.billet.create({
      data: {
        matchId, categorie, quantite, nomAcheteur, email,
        prixUnitaire: PRIX[categorie],
        total: +(PRIX[categorie] * quantite).toFixed(2),
      },
    });

    res.status(201).json({
      message: "Réservation confirmée !",
      data: {
        id: billet.id,
        match: `${match.domicile} vs ${match.exterieur}`,
        stade: match.stade,
        date: match.date,
        categorie: billet.categorie,
        quantite: billet.quantite,
        nomAcheteur: billet.nomAcheteur,
        email: billet.email,
        total: billet.total,
        statut: billet.statut,
      },
    });
  } catch (err) { next(err); }
});

// GET /api/billets/:id
router.get("/:id", async (req, res, next) => {
  try {
    const billet = await prisma.billet.findUnique({ where: { id: req.params.id } });
    if (!billet) return res.status(404).json({ error: "Billet introuvable" });
    res.json({ data: billet });
  } catch (err) { next(err); }
});

export default router;
