import level1 from "./level1.json";
import level2 from "./level2.json";
import level3 from "./level3.json";
import level4 from "./level4.json";
import level5 from "./level5.json";
import level6 from "./level6.json";
import level7 from "./level7.json";
import level8 from "./level8.json";

// Import AWS Developer certificate levels
import awsDeveloperLevel1 from "./dvac02/level1.json";
import awsDeveloperLevel2 from "./dvac02/level2.json";
import awsDeveloperLevel3 from "./dvac02/level3.json";
import awsDeveloperLevel4 from "./dvac02/level4.json";
import awsDeveloperLevel5 from "./dvac02/level5.json";
import awsDeveloperLevel6 from "./dvac02/level6.json";
import awsDeveloperLevel7 from "./dvac02/level7.json";
import awsDeveloperLevel8 from "./dvac02/level8.json";

// Import ANS-C01 certificate levels
import ansc01Level1 from "./ansc01/level1.json";
import ansc01Level2 from "./ansc01/level2.json";
import ansc01Level3 from "./ansc01/level3.json";
import ansc01Level4 from "./ansc01/level4.json";
import ansc01Level5 from "./ansc01/level5.json";

// Import SAA-C03 certificate levels
import saac03Level1 from "./saac03/level1.json";
import saac03Level10 from "./saac03/level10.json";
import saac03Level11 from "./saac03/level11.json";
import saac03Level12 from "./saac03/level12.json";
import saac03Level13 from "./saac03/level13.json";
import saac03Level2 from "./saac03/level2.json";
import saac03Level3 from "./saac03/level3.json";
import saac03Level4 from "./saac03/level4.json";
import saac03Level5 from "./saac03/level5.json";
import saac03Level6 from "./saac03/level6.json";
import saac03Level7 from "./saac03/level7.json";
import saac03Level8 from "./saac03/level8.json";
import saac03Level9 from "./saac03/level9.json";

// Import SAP-C02 certificate levels
import sapc02Level1 from "./sapc02/level1.json";
import sapc02Level2 from "./sapc02/level2.json";
import sapc02Level3 from "./sapc02/level3.json";
import sapc02Level4 from "./sapc02/level4.json";
import sapc02Level5 from "./sapc02/level5.json";
import sapc02Level6 from "./sapc02/level6.json";
import sapc02Level7 from "./sapc02/level7.json";

// Legacy quiz levels for backward compatibility
export const quizLevels = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
];

// Certificate levels mapping
export const certificateLevels = {
  dvac02: [
    awsDeveloperLevel1,
    awsDeveloperLevel2,
    awsDeveloperLevel3,
    awsDeveloperLevel4,
    awsDeveloperLevel5,
    awsDeveloperLevel6,
    awsDeveloperLevel7,
    awsDeveloperLevel8,
  ],
  ansc01: [
    ansc01Level1,
    ansc01Level2,
    ansc01Level3,
    ansc01Level4,
    ansc01Level5,
  ],
  saac03: [
    saac03Level1,
    saac03Level2,
    saac03Level3,
    saac03Level4,
    saac03Level5,
    saac03Level6,
    saac03Level7,
    saac03Level8,
    saac03Level9,
    saac03Level10,
    saac03Level11,
    saac03Level12,
    saac03Level13,
  ],
  sapc02: [
    sapc02Level1,
    sapc02Level2,
    sapc02Level3,
    sapc02Level4,
    sapc02Level5,
    sapc02Level6,
    sapc02Level7,
  ],
};
