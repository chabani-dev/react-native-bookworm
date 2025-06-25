import cron from "cron";
import axios from "axios";

// Nombre maximum d'erreurs consécutives autorisées
const MAX_FAILURES = 5;

// Compteur d'erreurs consécutifs
let failureCount = 0;

const job = new cron.CronJob("*/14 * * * *", async function () {
    // Vérifier si l'API_URL est définie
    if (!process.env.API_URL) {
        console.error("[CRON] API_URL is not defined. Skipping request.");
        failureCount++;
        checkFailureThreshold();
        return;
    }

    try {
        const response = await axios.get(process.env.API_URL, {
            timeout: 10000, // Timeout après 10 secondes
        });

        console.log(`[CRON] GET request successful. Status: ${response.status}`);
        failureCount = 0; // Réinitialiser le compteur en cas de succès
    } catch (error) {
        const status = error.response?.status || 'N/A';
        const message = error.message || 'Unknown error';

        console.error(`[CRON] GET request failed. Status: ${status}, Error: ${message}`);
        failureCount++;

        checkFailureThreshold();
    }
});

// Fonction qui vérifie si on a atteint la limite d'erreurs
function checkFailureThreshold() {
    if (failureCount >= MAX_FAILURES) {
        console.warn(`[CRON] Maximum failure threshold reached (${MAX_FAILURES}). Stopping the job.`);
        job.stop(); // Arrêter le job si trop d'erreurs
    }
}

// Démarrer le job seulement si l'API_URL est définie
if (process.env.API_URL) {
    job.start();
    console.log(`[CRON] Job started successfully. Running every 14 minutes.`);
} else {
    console.error(`[CRON] Cannot start job: API_URL is missing.`);
}

export default job;

// CRON JOB EXPLANATION
// CRON jobs are scheduled tasks run periodically at fixed intervals
// We want to send 1 GET request every 14 minutes

// How to define a "Schedule"?
// You define a schedule using a cron expression, which is a string that consists of five or six fields separated by spaces

// ! MINUTE , HOUR , DAY OF MONTH , MONTH , DAY OF WEEK , YEAR (optional)

// ? EXAMPLES & EXPLANATION:
// "*/14 * * * *" - Every 14 minutes
// "0 0 * * 0" - At midnight every Sunday
// "0 0 1 1 *" - At midnight on January 1st every year
// "0 * * * *" - At the start of every hour
