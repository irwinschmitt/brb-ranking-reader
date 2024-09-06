import { readFileSync } from "fs";

const OBJECTIVE_PATH = "docs/objetiva.txt";
const DISCURSIVE_PATH = "docs/discursiva.txt";

const objective = readFileSync(OBJECTIVE_PATH, "utf8");
const discursive = readFileSync(DISCURSIVE_PATH, "utf8");

const grades = {};

// PROVA OBJETIVA

const objectiveRegex = new RegExp(
  [
    "(\\d{10})", // Capture the 10-digit ID number
    "\\s+", // One or more spaces
    "[A-Z ]+", // Name (uppercase letters and spaces)
    "\\s+", // One or more spaces
    "((?:-\\s|Sim\\s){3})", // Three occurrences of "- " or "Sim "
    "\\d{2},\\d{1,2}", // Capture first numeric value (grade right before "Aprovado")
    "\\s\\d{2},\\d{1,2}", // Second numeric value (we don't need to capture this one)
    "(\\s\\d{2},\\d{1,2})", // Third numeric value (we don't need to capture this one)
    "\\sAprovado", // " Aprovado" string
    "(?:\\s(?:\\d+|-)){4}", // Four occurrences of a number or "-"
    "(?:\\s(?:-|Sim)){7}", // 9 or more occurrences of "- " or "Sim"
  ].join(""),
  "gim"
); // Flags: global, case-insensitive, multiline

Array.from(objective.matchAll(objectiveRegex)).forEach((match) => {
  const registrationNumber = match[1];
  const objectiveScore = parseFloat(match[3].replace(",", "."));

  const [rawPcd, rawPnp, rawHipo] = match[2].split(" ");
  const isPcd = rawPcd.trim().toUpperCase() === "SIM";
  const isPnp = rawPnp.trim().toUpperCase() === "SIM";
  const isHipo = rawHipo.trim().toUpperCase() === "SIM";

  grades[registrationNumber] = { objectiveScore, isPcd, isPnp, isHipo };
});

// PROVA DISCURSIVA

const discursiveApprovedLines = discursive
  .split("\n")
  .filter((line) => line.toUpperCase().includes("APROVADO"));

discursiveApprovedLines.forEach((line) => {
  const regex = /(\d{10})\s.*?(\d{1,3},\d{2})\sAprovado/g;
  const match = regex.exec(line);

  if (match) {
    const registrationNumber = match[1];
    const discursiveScore = parseFloat(match[2].replace(",", "."));

    if (grades[registrationNumber]) {
      const { objectiveScore } = grades[registrationNumber];

      grades[registrationNumber].discursiveScore = discursiveScore;
      grades[registrationNumber].totalScore = objectiveScore + discursiveScore;
    }
  }
});

// Filtra quem teve a redação corrigida e ordena pela nota total
const totalScoreRanking = Object.entries(grades)
  .filter(([, data]) => data.objectiveScore && data.discursiveScore)
  .map(([registrationNumber, data]) => ({ registrationNumber, ...data }))
  .sort((a, b) => b.totalScore - a.totalScore);

const pcdRanking = totalScoreRanking.filter(({ isPcd }) => isPcd);
const pnpRanking = totalScoreRanking.filter(({ isPnp }) => isPnp);
const hipoRanking = totalScoreRanking.filter(({ isHipo }) => isHipo);

console.log("\n--- RANKING GERAL ---\n");
totalScoreRanking.forEach((data, index) => {
  const position = `${index + 1}`.padStart(2, "0") + ". ";
  const id = `Inscrição: ${data.registrationNumber}  |  `;
  const objective = `Objetiva: ${data.objectiveScore.toFixed(2)}  |  `;
  const discursive = `Discursiva: ${data.discursiveScore.toFixed(2)}  |  `;
  const total = `Total: ${data.totalScore.toFixed(2)}.`;

  console.log(position + id + objective + discursive + total);
});

console.log("\n--- RANKING PCD ---\n");
pcdRanking.forEach((data, index) => {
  const position = `${index + 1}`.padStart(2, "0") + ". ";
  const id = `Inscrição: ${data.registrationNumber}  |  `;
  const objective = `Objetiva: ${data.objectiveScore.toFixed(2)}  |  `;
  const discursive = `Discursiva: ${data.discursiveScore.toFixed(2)}  |  `;
  const total = `Total: ${data.totalScore.toFixed(2)}.`;

  console.log(position + id + objective + discursive + total);
});

console.log("\n--- RANKING PNP ---\n");
pnpRanking.forEach((data, index) => {
  const position = `${index + 1}`.padStart(2, "0") + ". ";
  const id = `Inscrição: ${data.registrationNumber}  |  `;
  const objective = `Objetiva: ${data.objectiveScore.toFixed(2)}  |  `;
  const discursive = `Discursiva: ${data.discursiveScore.toFixed(2)}  |  `;
  const total = `Total: ${data.totalScore.toFixed(2)}.`;

  console.log(position + id + objective + discursive + total);
});

console.log("\n--- RANKING HIPO ---\n");
hipoRanking.forEach((data, index) => {
  const position = `${index + 1}`.padStart(2, "0") + ". ";
  const id = `Inscrição: ${data.registrationNumber}  |  `;
  const objective = `Objetiva: ${data.objectiveScore.toFixed(2)}  |  `;
  const discursive = `Discursiva: ${data.discursiveScore.toFixed(2)}  |  `;
  const total = `Total: ${data.totalScore.toFixed(2)}.`;

  console.log(position + id + objective + discursive + total);
});
