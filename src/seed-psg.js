import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Ajout des joueurs du Paris Saint-Germain 2025-2026...");

  const psgJoueurs = [
    // ── Gardiens ──────────────────────────────
    { nom: "Matvey Safonov",     equipe: "Paris Saint-Germain", position: "Gardien",          numero: 39, nationalite: "Russe",       age: 25, buts: 0,  passes: 0,  matchsJoues: 23 },
    { nom: "Lucas Chevalier",    equipe: "Paris Saint-Germain", position: "Gardien",          numero: 30, nationalite: "Française",   age: 24, buts: 0,  passes: 0,  matchsJoues: 15 },

    // ── Défenseurs ────────────────────────────
    { nom: "Achraf Hakimi",      equipe: "Paris Saint-Germain", position: "Latéral droit",    numero: 2,  nationalite: "Marocaine",   age: 26, buts: 3,  passes: 11, matchsJoues: 37, cartonsJaunes: 5 },
    { nom: "Marquinhos",         equipe: "Paris Saint-Germain", position: "Défenseur central",numero: 5,  nationalite: "Brésilienne", age: 30, buts: 4,  passes: 3,  matchsJoues: 34, cartonsJaunes: 3 },
    { nom: "Illia Zabarnyi",     equipe: "Paris Saint-Germain", position: "Défenseur central",numero: 6,  nationalite: "Ukrainienne", age: 22, buts: 1,  passes: 0,  matchsJoues: 34, cartonsJaunes: 7 },
    { nom: "Lucas Hernández",    equipe: "Paris Saint-Germain", position: "Défenseur central",numero: 21, nationalite: "Française",   age: 28, buts: 0,  passes: 3,  matchsJoues: 39, cartonsJaunes: 4 },
    { nom: "Nuno Mendes",        equipe: "Paris Saint-Germain", position: "Latéral gauche",   numero: 25, nationalite: "Portugaise",  age: 22, buts: 4,  passes: 7,  matchsJoues: 36, cartonsJaunes: 5 },
    { nom: "William Pacho",      equipe: "Paris Saint-Germain", position: "Défenseur central",numero: 51, nationalite: "Équatorienne",age: 23, buts: 4,  passes: 1,  matchsJoues: 44, cartonsJaunes: 1 },
    { nom: "Lucas Beraldo",      equipe: "Paris Saint-Germain", position: "Défenseur central",numero: 4,  nationalite: "Brésilienne", age: 21, buts: 2,  passes: 2,  matchsJoues: 27, cartonsJaunes: 1 },

    // ── Milieux ───────────────────────────────
    { nom: "Fabián Ruiz",        equipe: "Paris Saint-Germain", position: "Milieu central",   numero: 8,  nationalite: "Espagnole",   age: 28, buts: 5,  passes: 6,  matchsJoues: 35, cartonsJaunes: 3 },
    { nom: "Vitinha",            equipe: "Paris Saint-Germain", position: "Milieu central",   numero: 17, nationalite: "Portugaise",  age: 25, buts: 10, passes: 28, matchsJoues: 52, cartonsJaunes: 2 },
    { nom: "Warren Zaïre-Emery", equipe: "Paris Saint-Germain", position: "Milieu central",   numero: 33, nationalite: "Française",   age: 19, buts: 7,  passes: 4,  matchsJoues: 50, cartonsJaunes: 5 },
    { nom: "João Neves",         equipe: "Paris Saint-Germain", position: "Milieu défensif",  numero: 87, nationalite: "Portugaise",  age: 20, buts: 4,  passes: 7,  matchsJoues: 46, cartonsJaunes: 8 },
    { nom: "Senny Mayulu",       equipe: "Paris Saint-Germain", position: "Milieu offensif",  numero: 24, nationalite: "Française",   age: 19, buts: 4,  passes: 7,  matchsJoues: 42, cartonsJaunes: 2 },
    { nom: "Kang-in Lee",        equipe: "Paris Saint-Germain", position: "Milieu offensif",  numero: 19, nationalite: "Sud-coréenne",age: 24, buts: 4,  passes: 5,  matchsJoues: 41, cartonsJaunes: 3 },

    // ── Attaquants ────────────────────────────
    { nom: "Ousmane Dembélé",    equipe: "Paris Saint-Germain", position: "Ailier droit",     numero: 10, nationalite: "Française",   age: 27, buts: 20, passes: 16, matchsJoues: 45, cartonsJaunes: 2 },
    { nom: "Bradley Barcola",    equipe: "Paris Saint-Germain", position: "Ailier gauche",    numero: 29, nationalite: "Française",   age: 22, buts: 11, passes: 8,  matchsJoues: 36, cartonsJaunes: 1 },
    { nom: "Gonçalo Ramos",      equipe: "Paris Saint-Germain", position: "Avant-centre",     numero: 9,  nationalite: "Portugaise",  age: 23, buts: 9,  passes: 5,  matchsJoues: 32, cartonsJaunes: 1 },
    { nom: "Désiré Doué",        equipe: "Paris Saint-Germain", position: "Ailier",           numero: 14, nationalite: "Française",   age: 20, buts: 21, passes: 10, matchsJoues: 38, cartonsJaunes: 3 },
    { nom: "Khvicha Kvaratskhelia", equipe: "Paris Saint-Germain", position: "Ailier gauche", numero: 7,  nationalite: "Géorgienne",  age: 24, buts: 9,  passes: 9,  matchsJoues: 42, cartonsJaunes: 2 },
  ];

  let added = 0;
  let skipped = 0;

  for (const joueur of psgJoueurs) {
    const existing = await prisma.joueur.findFirst({
      where: { nom: joueur.nom, equipe: joueur.equipe },
    });

    if (!existing) {
      await prisma.joueur.create({ data: joueur });
      console.log(`  ✅ Ajouté : ${joueur.nom}`);
      added++;
    } else {
      console.log(`  ⏭️  Existe déjà : ${joueur.nom}`);
      skipped++;
    }
  }

  console.log(`\n📊 Résultat : ${added} joueurs ajoutés, ${skipped} déjà présents.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
