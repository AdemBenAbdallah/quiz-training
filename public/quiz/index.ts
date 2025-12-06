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
};
