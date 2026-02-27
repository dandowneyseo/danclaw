/**
 * DanClaw — CLI Splash Screen
 * Displays ASCII art and branding on every terminal startup
 */

const BLUE = '\x1b[38;2;74;158;255m';
const WHITE = '\x1b[97m';
const GRAY = '\x1b[90m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

const ASCII_DANCLAW = `
${BLUE}${BOLD}
  ██████╗  █████╗ ███╗   ██╗ ██████╗██╗      █████╗ ██╗    ██╗
    ██╔══██╗██╔══██╗████╗  ██║██╔════╝██║     ██╔══██╗██║    ██║
      ██║  ██║███████║██╔██╗ ██║██║     ██║     ███████║██║ █╗ ██║
        ██║  ██║██╔══██║██║╚██╗██║██║     ██║     ██╔══██║██║███╗██║
          ██████╔╝██║  ██║██║ ╚████║╚██████╗███████╗██║  ██║╚███╔███╔╝
            ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝
            ${RESET}`;

const ASCII_CRAB = `
${BLUE}
      /|\\   /|\\
        ___/ | \\_/ | \\___
         /  \\  |     |  /  \\
         |    \\ |     | /    |
          \\    \\|_____|/    /
            \\_______________/
                 |  |   |  |
                      |  |   |  |
                      ${RESET}`;

export function printSplash(): void {
    console.clear();
    console.log(ASCII_DANCLAW);
    console.log(ASCII_CRAB);
    console.log(`${BLUE}${BOLD}          danclaw.ai  |  danclaw.com${RESET}`);
    console.log(`${WHITE}          Support: (916)826-9410${RESET}`);
    console.log(`${GRAY}          AI Agent for Service Businesses${RESET}`);
    console.log('');
}

export async function printSplashWithDelay(): Promise<void> {
    printSplash();
    process.stdout.write(`${BLUE}  Initializing DanClaw${RESET}`);

  // Blinking cursor effect for 3 seconds
  for (let i = 0; i < 6; i++) {
        await sleep(500);
        process.stdout.write(`${BLUE}.${RESET}`);
  }

  console.log(`\n${WHITE}  Ready.${RESET}\n`);
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
