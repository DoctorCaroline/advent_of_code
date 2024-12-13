import { AdventOfCodeBehavior } from "./AdventOfCodeBehavior";
const [year, day] = process.argv.slice(2).map(Number);
(new AdventOfCodeBehavior()).initialize(year, day);