import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Initialisation de la base de données...");

  await prisma.joueur.createMany({
    skipDuplicates: true,
    data: [
      { nom: "Kylian Mbappé",   equipe: "Real Madrid",         position: "Attaquant",     numero: 9,  nationalite: "Française",   age: 25, buts: 32, passes: 11, matchsJoues: 38 },
      { nom: "Vinicius Jr",     equipe: "Real Madrid",         position: "Ailier gauche", numero: 7,  nationalite: "Brésilienne", age: 23, buts: 24, passes: 18, matchsJoues: 35, cartonsJaunes: 5, cartonsRouges: 1 },
      { nom: "Erling Haaland",  equipe: "Manchester City",     position: "Attaquant",     numero: 9,  nationalite: "Norvégienne", age: 23, buts: 36, passes: 7,  matchsJoues: 34 },
      { nom: "Ousmane Dembélé", equipe: "Paris Saint-Germain", position: "Ailier droit",  numero: 10, nationalite: "Française",   age: 27, buts: 18, passes: 22, matchsJoues: 36 },
    ],
  });

  await prisma.match.createMany({
    skipDuplicates: true,
    data: [
      { domicile: "Paris Saint-Germain", exterieur: "Olympique de Marseille", competition: "Ligue 1",        date: new Date("2025-04-05T21:00:00Z"), stade: "Parc des Princes",  statut: "terminé",  scoreDom: 3, scoreExt: 1 },
      { domicile: "Real Madrid",         exterieur: "FC Barcelone",           competition: "Liga",           date: new Date("2025-04-20T20:00:00Z"), stade: "Santiago Bernabéu", statut: "en cours", scoreDom: 2, scoreExt: 2 },
      { domicile: "Manchester City",     exterieur: "Arsenal",                competition: "Premier League", date: new Date("2025-05-10T17:30:00Z"), stade: "Etihad Stadium",    statut: "à venir",  scoreDom: null, scoreExt: null },
    ],
  });

  await prisma.menuItem.createMany({
    skipDuplicates: true,
    data: [
      { nom: "Hot-dog classique",   categorie: "Snack",   prix: 5.5  },
      { nom: "Burger du stade",     categorie: "Plat",    prix: 9.0  },
      { nom: "Nachos fromage",      categorie: "Snack",   prix: 6.0  },
      { nom: "Coca-Cola 50cl",      categorie: "Boisson", prix: 3.5  },
      { nom: "Bière pression 50cl", categorie: "Boisson", prix: 6.0  },
      { nom: "Eau minérale",        categorie: "Boisson", prix: 2.0  },
      { nom: "Pizza pepperoni",     categorie: "Plat",    prix: 11.0, disponible: false },
    ],
  });

  console.log("✅ Base de données initialisée !");
}

main().catch(console.error).finally(() => prisma.$disconnect());
