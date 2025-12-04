# Best Setup: Bun + Claude Code in Docker with Zed Editor

This guide covers the optimal configuration for running Bun and Claude Code inside a Docker container while editing with Zed, keeping your code locally on your host machine.

## Overview

The recommended approach uses:
- **Docker container** with Bun runtime and Claude Code installed
- **SSH server** running inside the container for Zed's remote development feature
- **Volume mounts** to keep your code on the local filesystem
- **Zed's SSH remote development** to connect to the container

This gives you:
- Isolated development environment
- Local code persistence (survives container restarts)
- Full Zed editor experience with language servers running in container
- Claude Code running safely sandboxed

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Local Machine                       │
│                                                              │
│  ┌──────────────┐     SSH      ┌──────────────────────────┐ │
│  │              │◄────────────►│    Docker Container      │ │
│  │   Zed UI     │              │                          │ │
│  │              │              │  - Bun Runtime           │ │
│  └──────────────┘              │  - Claude Code CLI       │ │
│                                │  - SSH Server            │ │
│                                │  - Language Servers      │ │
│  ┌──────────────┐              │                          │ │
│  │ ~/projects/  │◄─── mount ──►│  /workspace              │ │
│  │   (local)    │              │                          │ │
│  └──────────────┘              └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Setup Files

### 1. Dockerfile

Create a `Dockerfile` in your project or a dedicated config directory:

```dockerfile
FROM oven/bun:1

ARG USER_NAME=dev
ARG USER_PASSWORD=dev
ARG SSH_PORT=2222

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssh-server \
    sudo \
    git \
    curl \
    ca-certificates \
    ripgrep \
    fd-find \
    jq \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (some tools may need it alongside Bun)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code CLI globally
RUN npm install -g @anthropic-ai/claude-code

# Configure SSH
RUN mkdir -p /var/run/sshd \
    && echo "Port ${SSH_PORT}" >> /etc/ssh/sshd_config \
    && echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config \
    && echo "PermitEmptyPasswords no" >> /etc/ssh/sshd_config \
    && echo "PermitUserEnvironment yes" >> /etc/ssh/sshd_config

# Create user with sudo access
RUN useradd -m -s /bin/bash ${USER_NAME} \
    && echo "${USER_NAME}:${USER_PASSWORD}" | chpasswd \
    && usermod -aG sudo ${USER_NAME} \
    && echo "${USER_NAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Setup user environment
USER ${USER_NAME}
WORKDIR /home/${USER_NAME}

# Create environment file for SSH sessions
RUN mkdir -p ~/.ssh \
    && echo "PATH=/usr/local/bin:/home/${USER_NAME}/.bun/bin:/home/${USER_NAME}/.local/bin:\$PATH" >> ~/.ssh/environment \
    && echo "BUN_INSTALL=/home/${USER_NAME}/.bun" >> ~/.ssh/environment

# Create workspace directory
RUN mkdir -p /home/${USER_NAME}/workspace

USER root

EXPOSE ${SSH_PORT}

# Start SSH server
CMD ["/usr/sbin/sshd", "-D", "-e"]
```

### 2. Docker Compose (docker-compose.yml)

```yaml
services:
  dev:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        USER_NAME: dev
        USER_PASSWORD: dev
        SSH_PORT: 2222
    container_name: bun-claude-dev
    ports:
      - "2222:2222"     # SSH for Zed
      - "3000:3000"     # Dev server
      - "5173:5173"     # Vite
      - "8080:8080"     # Alternative port
    volumes:
      # Mount your projects directory
      - ./:/workspace
      # Persist Claude Code config
      - claude-config:/home/dev/.claude
      # Persist bun cache for faster installs
      - bun-cache:/home/dev/.bun
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}
    restart: unless-stopped
    # Keep container running
    tty: true
    stdin_open: true

volumes:
  claude-config:
  bun-cache:
```

### 3. Environment File (.env)

```bash
# Add your Anthropic API key here (optional - Claude Code will prompt if not set)
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Initial Setup

### Step 1: Build and Start Container

```bash
# Navigate to your project directory
cd ~/projects/my-project

# Build and start the container
docker compose up -d --build

# Verify it's running
docker compose ps
```

### Step 2: Configure SSH on Host

Add to your `~/.ssh/config`:

```
Host bun-dev
    HostName localhost
    User dev
    Port 2222
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

### Step 3: Test SSH Connection

```bash
# Test the connection (password: dev)
ssh bun-dev

# Verify Bun is available
bun --version

# Verify Claude Code is available
claude --version
```

---

## Connecting Zed

### Method 1: Via Command Palette

1. Open Zed
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
3. Type "Remote Projects" and select it
4. Click "Connect New Server"
5. Enter: `bun-dev` (uses your SSH config)
6. Select `/workspace` as your project folder

### Method 2: Via Zed CLI

```bash
# Open workspace directly
zed ssh://dev:dev@localhost:2222/workspace
```

### Method 3: Configure in Zed Settings

Add to your Zed settings (`~/.config/zed/settings.json`):

```json
{
  "ssh_connections": [
    {
      "host": "bun-dev",
      "port_forwards": [
        { "local_port": 3000, "remote_port": 3000 },
        { "local_port": 5173, "remote_port": 5173 }
      ]
    }
  ]
}
```

---

## Using Claude Code in Container

### Interactive Session

```bash
# SSH into container
ssh bun-dev

# Navigate to workspace
cd /workspace

# Start Claude Code
claude
```

### Authenticate Claude Code

On first run, Claude Code will prompt for authentication:

1. Choose your login method (Subscription or API key)
2. Follow the prompts to authenticate
3. Credentials are persisted in the `claude-config` Docker volume

### Running Claude Code in "Dangerous" Mode (Container-Safe)

Since the container is isolated, you can run Claude Code with skip permissions:

```bash
claude --dangerously-skip-permissions
```

---

## Development Workflow

### Starting a New Project

```bash
# From your host machine, create project structure
mkdir -p ~/projects/my-bun-app
cd ~/projects/my-bun-app

# Copy docker files here (or create a central dev container)
# Then start the container
docker compose up -d

# Connect with Zed
zed ssh://dev:dev@localhost:2222/workspace
```

### Inside the Container Terminal (via Zed)

```bash
# Initialize Bun project
bun init

# Install dependencies
bun install

# Run development server
bun run dev

# Use Claude Code for assistance
claude "Help me create a REST API with Hono"
```

---

## Advanced Configuration

### Multiple Project Support

Create a central dev container that mounts multiple projects:

```yaml
# docker-compose.yml for multi-project setup
services:
  dev:
    build: .
    volumes:
      - ~/projects:/workspace
    # ... rest of config
```

### Custom Bun Version

Pin a specific Bun version in your Dockerfile:

```dockerfile
FROM oven/bun:1.1.42
```

### Adding More Tools

Extend the Dockerfile for additional tooling:

```dockerfile
# Add after base installs
RUN apt-get update && apt-get install -y \
    postgresql-client \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Install additional global packages
RUN bun install -g typescript tsx prettier eslint
```

### Zed Tasks for Container Operations

Create `.zed/tasks.json` in your project:

```json
[
  {
    "label": "Claude: Interactive",
    "command": "claude",
    "use_new_terminal": true,
    "reveal": "always"
  },
  {
    "label": "Claude: Current File",
    "command": "claude",
    "args": ["${ZED_FILE}"],
    "use_new_terminal": true,
    "reveal": "always"
  },
  {
    "label": "Bun: Install",
    "command": "bun install",
    "use_new_terminal": false
  },
  {
    "label": "Bun: Dev Server",
    "command": "bun run dev",
    "use_new_terminal": true,
    "reveal": "always"
  }
]
```

---

## Troubleshooting

### SSH Connection Issues

```bash
# Check container is running
docker compose ps

# View container logs
docker compose logs -f

# Manually test SSH
ssh -v bun-dev
```

### Zed Can't Connect

1. Ensure container is running with SSH port exposed
2. Test SSH connection manually first
3. Check Zed logs: `Cmd+Shift+P` → "Open Log"

### Claude Code Authentication

```bash
# Inside container, reset auth
rm -rf ~/.claude
claude  # Re-authenticate
```

### Port Forwarding Not Working

Ensure ports are exposed in docker-compose.yml and configured in Zed settings:

```json
{
  "ssh_connections": [
    {
      "host": "bun-dev",
      "port_forwards": [
        { "local_port": 3000, "remote_port": 3000 }
      ]
    }
  ]
}
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start container |
| `docker compose down` | Stop container |
| `docker compose logs -f` | View logs |
| `ssh bun-dev` | Connect via SSH |
| `zed ssh://dev:dev@localhost:2222/workspace` | Open in Zed |
| `bun --version` | Check Bun version |
| `claude` | Start Claude Code |
| `claude --dangerously-skip-permissions` | Claude with auto-approve |

---

## Security Considerations

1. **Change default password** in production: Update `USER_PASSWORD` arg
2. **Use SSH keys** instead of passwords for better security
3. **Network isolation**: Container is isolated from host system
4. **API key management**: Use `.env` file (gitignored) or Docker secrets
5. **Volume permissions**: Ensure mounted files have correct ownership

---

## Alternative: Devcontainer CLI Approach

If you prefer the devcontainer specification:

```json
// .devcontainer/devcontainer.json
{
  "name": "Bun + Claude",
  "image": "oven/bun:1",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {},
    "ghcr.io/devcontainers/features/git:1": {}
  },
  "postCreateCommand": "npm install -g @anthropic-ai/claude-code",
  "forwardPorts": [3000, 5173],
  "remoteUser": "bun"
}
```

Use with `devcontainer` CLI and Zed tasks, though native SSH approach provides better integration with Zed's remote development features.
