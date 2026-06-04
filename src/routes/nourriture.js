import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/nourriture/menu
router.get("/menu", async (req, res, next) => {
  try {
    const { categorie } = req.query;
    const where = {};
    if (categorie) where.categorie = { equals: categorie, mode: "insensitive" };

    const items = await prisma.menuItem.findMany({ where });
    res.json({ data: items, total: items.length });
  } catch (err) { next(err); }
});

// POST /api/nourriture/commander
router.post("/commander", async (req, res, next) => {
  try {
    const { matchId, siege, items } = req.body;

    if (!matchId || !siege || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Champs requis : matchId, siege, items[]",
      });
    }

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) return res.status(404).json({ error: "Match introuvable" });

    const lignesData = [];
    for (const item of items) {
      const produit = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!produit) return res.status(404).json({ error: `Article #${item.menuItemId} introuvable` });
      if (!produit.disponible) return res.status(409).json({ error: `"${produit.nom}" n'est plus disponible` });
      lignesData.push({
        menuItemId:   produit.id,
        quantite:     item.quantite,
        prixUnitaire: produit.prix,
        sousTotal:    +(produit.prix * item.quantite).toFixed(2),
      });
    }

    const total = +(lignesData.reduce((a, l) => a + l.sousTotal, 0)).toFixed(2);

    const commande = await prisma.commande.create({
      data: { matchId, siege, total, lignes: { create: lignesData } },
      include: { lignes: { include: { menuItem: true } } },
    });

    res.status(201).json({
      message: "Commande passée avec succès !",
      data: {
        id: commande.id,
        siege: commande.siege,
        statut: commande.statut,
        estimationLivraison: commande.estimationLivraison,
        items: commande.lignes.map((l) => ({
          nom: l.menuItem.nom,
          quantite: l.quantite,
          sousTotal: l.sousTotal,
        })),
        total: commande.total,
      },
    });
  } catch (err) { next(err); }
});

// GET /api/nourriture/commandes/:id
router.get("/commandes/:id", async (req, res, next) => {
  try {
    const commande = await prisma.commande.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { lignes: { include: { menuItem: true } } },
    });
    if (!commande) return res.status(404).json({ error: "Commande introuvable" });
    res.json({ data: commande });
  } catch (err) { next(err); }
});

export default router;
