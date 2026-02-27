/**
 * DanClaw — Wizard Server
 * Serves the setup wizard on port 3000
 * Accessible at http://danclaw.local or http://localhost:3000
 */

import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.danclaw');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

export function startWizardServer(port = 3000): void {
    const app = express();
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../src/splash')));

  // Serve the wizard HTML
  app.get('/', (req, res) => {
        const wizardPath = path.join(__dirname, '../src/wizard/wizard.html');
        if (fs.existsSync(wizardPath)) {
                res.sendFile(wizardPath);
        } else {
                res.send('<h1>DanClaw Setup</h1><p>Wizard file not found. Please reinstall.</p>');
        }
  });

  app.get('/wizard', (req, res) => {
        const wizardPath = path.join(__dirname, '../src/wizard/wizard.html');
        res.sendFile(wizardPath);
  });

  // Serve splash HTML
  app.get('/splash', (req, res) => {
        const splashPath = path.join(__dirname, '../src/splash/splash.html');
        res.sendFile(splashPath);
  });

  // Serve crab SVG
  app.get('/assets/crab.svg', (req, res) => {
        res.sendFile(path.join(__dirname, '../assets/crab.svg'));
  });

  // Check config status
  app.get('/api/status', (req, res) => {
        const configExists = fs.existsSync(CONFIG_PATH);
        if (configExists) {
                try {
                          const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
                          res.json({ setup_complete: config.setup_complete || false });
                } catch {
                          res.json({ setup_complete: false });
                }
        } else {
                res.json({ setup_complete: false });
        }
  });

  // Save config from wizard
  app.post('/api/setup', (req, res) => {
        try {
                const data = req.body;

          if (!fs.existsSync(CONFIG_DIR)) {
                    fs.mkdirSync(CONFIG_DIR, { recursive: true });
          }

          const config = {
                    setup_complete: true,
                    business: {
                                name: data.business_name || '',
                                city_state: data.city_state || '',
                                phone: data.phone || '',
                                website: data.website || '',
                                type: data.business_type || '',
                    },
                    llm: {
                                provider: data.llm_provider || '',
                                api_key: data.api_key || '',
                                model: data.model || '',
                    },
                    telegram: {
                                bot_token: data.telegram_token || '',
                                operator_chat_id: data.operator_chat_id || '',
                    },
                    danclaw: {
                                version: '1.0.0',
                                support_phone: '9168269410',
                                support_url: 'danclaw.ai',
                    },
          };

          fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
                res.json({ success: true, message: 'DanClaw configured successfully.' });

          // Restart after 2 seconds
          setTimeout(() => {
                    console.log('\n✅  Setup complete. Restarting DanClaw...\n');
                    process.exit(0); // systemd will auto-restart
          }, 2000);

        } catch (err: any) {
                res.status(500).json({ success: false, error: err.message });
        }
  });

  app.listen(port, '0.0.0.0', () => {
        console.log(`\n🌐  DanClaw Setup Wizard running at:`);
        console.log(`    http://localhost:${port}`);
        console.log(`    http://danclaw.local:${port}`);
        console.log(`\n    Open this URL in any browser on your network.\n`);
  });
}
