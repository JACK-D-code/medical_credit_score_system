const fs = require('fs');
let content = fs.readFileSync('src/controllers/provider.controller.ts', 'utf8');

// Add the import
if (!content.includes('calculateScoreLogic')) {
    content = content.replace(
        "import { AuthRequest } from '../middleware/auth';",
        "import { AuthRequest } from '../middleware/auth';\nimport { calculateScoreLogic } from './score.controller';"
    );
}

// Replace the old evaluatePatient string (the one that has "Unauthorized. Only providers")
const oldFuncStr = `export const evaluatePatient = async (req: AuthRequest, res: Response): Promise<void> => {\r
    try {\r
        if (req.user?.role !== 'PROVIDER' && req.user?.role !== 'ADMIN') {\r
            res.status(403).json({ error: 'Unauthorized. Only providers can evaluate patients.' });`;
const oldFuncStrUnix = `export const evaluatePatient = async (req: AuthRequest, res: Response): Promise<void> => {\n    try {\n        if (req.user?.role !== 'PROVIDER' && req.user?.role !== 'ADMIN') {\n            res.status(403).json({ error: 'Unauthorized. Only providers can evaluate patients.' });`;

content = content.replace(oldFuncStr, oldFuncStr.replace('export const evaluatePatient', 'export const evaluatePatientOld'));
content = content.replace(oldFuncStrUnix, oldFuncStrUnix.replace('export const evaluatePatient', 'export const evaluatePatientOld'));

fs.writeFileSync('src/controllers/provider.controller.ts', content);
console.log('Done');
