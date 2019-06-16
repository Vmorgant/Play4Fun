export interface Game {
  name: string;
  logo: string;
  limitedTime : boolean;
  timer : number;
  guideline : string;
  page: string;
}
export const GAMESLIST: Game[] = [
  {name: 'Number Click', logo: 'assets/imgs/number.png',limitedTime : true,timer : 20, guideline:"Click the button as fast you can",page:"NumberClickPage" },
  {name: 'Animal Match', logo: 'assets/imgs/animals.png',limitedTime : true, timer : 60, guideline:"Match at least 3 animals",page:"AnimalMatchPage"},
];

