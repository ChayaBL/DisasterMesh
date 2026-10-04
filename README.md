# DisasterMesh

> **When the internet goes down, intelligence stays connected.**

DisasterMesh is a high-fidelity simulation of a decentralized AI-powered disaster-response intelligence network. It models how autonomous agents can continue coordinating when communication is degraded, nodes fail, or an agent becomes compromised.

## What it demonstrates

- **Decentralized swarm intelligence** — disaster-response nodes communicate without a single central dependency.
- **AI agent coordination** — each node represents an autonomous agent observing and contributing to the incident response.
- **Dynamic trust intelligence** — agent trust changes based on telemetry consistency, peer agreement, reliability, and communication health.
- **Autonomous verification** — suspicious telemetry can be independently checked by peer agents.
- **Cyber-threat response** — compromised nodes can be detected, isolated, and removed from critical routes.
- **Self-healing mesh routing** — the network can discover alternate communication paths after node failure or isolation.
- **AI route optimization** — response routes are scored using reliability, latency, and risk.
- **Autonomous incident simulation** — a complete disaster-response sequence can be demonstrated from detection through stabilization.

## Simulation Scenarios

### Normal
Baseline network monitoring.

### Flood
Simulates escalating disaster conditions and evacuation optimization.

### Cyber Attack
Demonstrates anomalous agent behavior, trust collapse, independent verification, node isolation, and mesh recovery.

### Node Failure
Simulates relay-node failure followed by autonomous route recovery.

### Autonomous Incident
Runs the complete response chain automatically from detection to stabilization.

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Lucide React

## Run Locally

```bash
npm install
npm run dev