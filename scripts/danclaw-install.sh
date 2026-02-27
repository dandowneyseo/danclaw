#!/bin/bash
# ================================================
# DanClaw — Raspberry Pi 5 Install Script
# danclaw.ai | (916)826-9410
# Safe to run multiple times (idempotent)
# ================================================

set -e

DANCLAW_DIR="/home/pi/danclaw"
DANCLAW_REPO="https://github.com/dandowneyseo/danclaw.git"
NODE_VERSION="20"

echo ""
echo "================================================"
echo "  DanClaw AI Agent — Raspberry Pi 5 Installer"
echo "  danclaw.ai  |  (916)826-9410"
echo "================================================"
echo ""

# ── System Update ────────────────────────────────
echo "[1/7] Updating system packages..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
echo "      Done."

# ── Install Node.js ──────────────────────────────
echo "[2/7] Installing Node.js ${NODE_VERSION}..."
if ! command -v node &>/dev/null || [[ "$(node -v)" != v${NODE_VERSION}* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash - -qq
    sudo apt-get install -y nodejs -qq
      echo "      Node.js $(node -v) installed."
      else
        echo "      Node.js $(node -v) already installed."
        fi

        # ── Install Dependencies ─────────────────────────
        echo "[3/7] Installing system dependencies..."
        sudo apt-get install -y git curl wget avahi-daemon -qq
        echo "      Done."

        # ── Set Hostname ─────────────────────────────────
        echo "[4/7] Setting hostname to 'danclaw'..."
        CURRENT_HOSTNAME=$(hostname)
        if [ "$CURRENT_HOSTNAME" != "danclaw" ]; then
          echo "danclaw" | sudo tee /etc/hostname > /dev/null
            sudo sed -i "s/$CURRENT_HOSTNAME/danclaw/g" /etc/hosts
              echo "      Hostname set to: danclaw"
                echo "      Device will be accessible at: http://danclaw.local"
                else
                  echo "      Hostname already set to danclaw."
                  fi

                  # ── Clone or Update DanClaw ──────────────────────
                  echo "[5/7] Installing DanClaw..."
                  if [ -d "$DANCLAW_DIR/.git" ]; then
                    echo "      Updating existing installation..."
                      cd "$DANCLAW_DIR"
                        git pull origin main -q
                        else
                          echo "      Cloning DanClaw..."
                            git clone "$DANCLAW_REPO" "$DANCLAW_DIR" -q
                              cd "$DANCLAW_DIR"
                              fi

                              # Install npm packages
                              echo "      Installing npm packages (this takes a minute)..."
                              npm install --omit=dev --silent

                              # Build TypeScript
                              echo "      Building DanClaw..."
                              npm run build

                              # Create config directory
                              mkdir -p ~/.danclaw
                              echo "      Done."

                              # ── Set Up systemd Service ───────────────────────
                              echo "[6/7] Setting up DanClaw service..."
                              sudo tee /etc/systemd/system/danclaw.service > /dev/null <<EOF
                              [Unit]
                              Description=DanClaw AI Agent
                              After=network-online.target
                              Wants=network-online.target

                              [Service]
                              Type=simple
                              User=pi
                              WorkingDirectory=${DANCLAW_DIR}
                              ExecStart=/usr/bin/node ${DANCLAW_DIR}/dist/index.js
                              Restart=always
                              RestartSec=10
                              Environment=NODE_ENV=production

                              [Install]
                              WantedBy=multi-user.target
                              EOF

                              sudo systemctl daemon-reload
                              sudo systemctl enable danclaw -q
                              sudo systemctl restart danclaw
                              echo "      DanClaw service enabled and started."

                              # ── Enable Avahi for .local DNS ──────────────────
                              echo "[7/7] Enabling network discovery (danclaw.local)..."
                              sudo systemctl enable avahi-daemon -q
                              sudo systemctl restart avahi-daemon
                              echo "      Done."

                              # ── Complete ─────────────────────────────────────
                              echo ""
                              echo "================================================"
                              echo "  DanClaw installed successfully!"
                              echo ""
                              echo "  Open your browser and go to:"
                              echo "  http://danclaw.local"
                              echo "  (or http://$(hostname -I | awk '{print $1}'))"
                              echo ""
                              echo "  Complete setup in under 2 minutes."
                              echo ""
                              echo "  Need help?"
                              echo "  Text Dan: (916)826-9410"
                              echo "  Visit:    danclaw.ai"
                              echo "================================================"
                              echo ""
