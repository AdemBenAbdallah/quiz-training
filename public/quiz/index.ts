import level1 from "./level1.json";
import level2 from "./level2.json";
import level3 from "./level3.json";
import level4 from "./level4.json";
import level5 from "./level5.json";
import level6 from "./level6.json";
import level7 from "./level7.json";
import level8 from "./level8.json";

// Import AWS Developer certificate levels
import awsDeveloperLevel1 from "./aws-developer/level1.json";
import awsDeveloperLevel2 from "./aws-developer/level2.json";
import awsDeveloperLevel3 from "./aws-developer/level3.json";
import awsDeveloperLevel4 from "./aws-developer/level4.json";
import awsDeveloperLevel5 from "./aws-developer/level5.json";
import awsDeveloperLevel6 from "./aws-developer/level6.json";
import awsDeveloperLevel7 from "./aws-developer/level7.json";
import awsDeveloperLevel8 from "./aws-developer/level8.json";

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
  "aws-developer": [
    awsDeveloperLevel1,
    awsDeveloperLevel2,
    awsDeveloperLevel3,
    awsDeveloperLevel4,
    awsDeveloperLevel5,
    awsDeveloperLevel6,
    awsDeveloperLevel7,
    awsDeveloperLevel8,
  ],
};
