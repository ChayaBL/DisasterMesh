import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  ChevronRight,
  CircleDot,
  Cpu,
  Crosshair,
  Database,
  Eye,
  Flame,
  Gauge,
  Globe2,
  HeartPulse,
  MapPin,
  Navigation,
  Radio,
  Route,
  Shield,
    ShieldAlert,
    ShieldCheck,
    Siren,
  Sparkles,
  Truck,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import "./App.css";

const initialNodes = [
  {
    id: "N-01",
    type: "Emergency Station",
    short: "STATION",
    x: 16,
    y: 25,
    trust: 98,
    status: "ONLINE",
    role: "Command relay",
  },
  {
    id: "N-02",
    type: "Aerial Drone",
    short: "DRONE",
    x: 54,
    y: 17,
    trust: 96,
    status: "ONLINE",
    role: "Flood reconnaissance",
  },
  {
    id: "N-03",
    type: "Rescue Vehicle",
    short: "RESCUE",
    x: 72,
    y: 63,
    trust: 91,
    status: "VERIFYING",
    role: "Independent verifier",
  },
  {
    id: "N-04",
    type: "Mobile Relay",
    short: "RELAY",
    x: 37,
    y: 70,
    trust: 94,
    status: "ONLINE",
    role: "Mesh routing",
  },
  {
    id: "N-05",
    type: "Field Phone",
    short: "PHONE",
    x: 78,
    y: 30,
    trust: 87,
    status: "ONLINE",
    role: "Civilian telemetry",
  },
  {
    id: "N-07",
    type: "Unknown Device",
    short: "UNKNOWN",
    x: 48,
    y: 48,
    trust: 42,
    status: "SUSPICIOUS",
    role: "Conflicting telemetry",
  },
];

const baseEvents = [
  ["19:42", "Flood signal received", "N-02"],
  ["19:43", "Agent disagreement detected", "N-07"],
  ["19:44", "Independent verification requested", "N-03"],
  ["19:45", "Rescue route recalculated", "SYSTEM"],
];

const scenarios = {
  NORMAL: {
    label: "MONITORING",
    title: "Network operating normally",
    severity: 38,
    zone: "ELEVATED",
    color: "cyan",
  },
  FLOOD: {
    label: "FLOOD RESPONSE",
    title: "Rapid water-level escalation detected",
    severity: 78,
    zone: "CRITICAL",
    color: "red",
  },
  CYBER_ATTACK: {
    label: "CYBER ANOMALY",
    title: "Agent N-07 showing anomalous behaviour",
    severity: 86,
    zone: "HIGH RISK",
    color: "orange",
  },
  NODE_FAILURE: {
    label: "NETWORK FAILURE",
    title: "Relay node lost — rerouting mesh",
    severity: 63,
    zone: "DEGRADED",
    color: "yellow",
  },
};

function App() {
  const [scenario, setScenario] = useState("NORMAL");
  const [nodes, setNodes] = useState(initialNodes);
  const scenarioTimers = useRef([]);

    const addScenarioTimer = (callback, delay) => {
        const timer = setTimeout(callback, delay);
        scenarioTimers.current.push(timer);
    };
  const [selectedNode, setSelectedNode] = useState("N-07");
  const [incidentRunning, setIncidentRunning] = useState(false);
  const [incidentStep, setIncidentStep] = useState(0);
  const [events, setEvents] = useState(baseEvents);
  const [meshRecovery, setMeshRecovery] = useState(false);

  const [verificationStatus, setVerificationStatus] = useState("IDLE");
    const [verificationProgress, setVerificationProgress] = useState(0);

  const activeScenario = scenarios[scenario];

  const routeOptions = useMemo(() => {
    if (meshRecovery) {
        return [
        {
            id: "A",
            path: "N-01 → N-02 → N-05",
            reliability: 62,
            latency: 81,
            risk: "HIGH",
            score: 58,
            selected: false,
        },
        {
            id: "B",
            path: "N-02 → N-03 → N-05",
            reliability: 94,
            latency: 47,
            risk: "LOW",
            score: 91,
            selected: true,
        },
        {
            id: "C",
            path: "N-01 → N-04 → N-05",
            reliability: 78,
            latency: 63,
            risk: "MEDIUM",
            score: 74,
            selected: false,
        },
        ];
    }

    return [
        {
        id: "A",
        path: "N-01 → N-02 → N-05",
        reliability: 91,
        latency: 42,
        risk: "LOW",
        score: 89,
        selected: true,
        },
        {
        id: "B",
        path: "N-01 → N-03 → N-05",
        reliability: 83,
        latency: 56,
        risk: "MEDIUM",
        score: 78,
        selected: false,
        },
    ];
    }, [scenario, meshRecovery]);

  const selected = useMemo(
    () => nodes.find((node) => node.id === selectedNode),
    [nodes, selectedNode]
  );

  const networkHealth = scenario === "CYBER_ATTACK"
    ? 82.4
    : scenario === "NODE_FAILURE"
      ? 88.7
      : scenario === "FLOOD"
        ? 93.2
        : 98.7;

  const resources = scenario === "FLOOD"
    ? { rescue: 4, drones: 2, medical: 31 }
    : { rescue: 6, drones: 3, medical: 42 };

  const runScenario = (type) => {
    scenarioTimers.current.forEach(clearTimeout);
    scenarioTimers.current = [];
    
    setMeshRecovery(false);
    setVerificationStatus("IDLE");
    setVerificationProgress(0);
    
    setScenario(type);
    setIncidentRunning(false);
    setIncidentStep(0);

    if (type === "CYBER_ATTACK") {

    // Initial suspicious behaviour
    setVerificationStatus("DETECTING");
    setVerificationProgress(15);

    setNodes((current) =>
        current.map((node) =>
        node.id === "N-07"
            ? {
                ...node,
                trust: 18,
                status: "COMPROMISED",
            }
            : node
        )
    );

    setSelectedNode("N-07");

    setEvents([
        ["NOW", "Anomalous behaviour detected", "N-07"],
        ["NOW", "Trust score collapsed to 18%", "TRUST"],
        ["NOW", "Verification request created", "AI"],
        ...baseEvents,
    ]);

    // STEP 1 — Verification begins
    addScenarioTimer(() => {
        setVerificationStatus("VERIFYING");
        setVerificationProgress(45);

        setEvents((current) => [
        ["NOW", "N-03 dispatched for independent verification", "N-03"],
        ...current,
        ]);
    }, 1200);

    // STEP 2 — Peer evidence arrives
    addScenarioTimer(() => {
        setVerificationStatus("ANALYZING");
        setVerificationProgress(70);

        setEvents((current) => [
        ["NOW", "Peer telemetry comparison completed", "TRUST"],
        ["NOW", "N-05 confirms conflicting signal", "N-05"],
        ...current,
        ]);
    }, 2400);

    // STEP 3 — Final decision
    setTimeout(() => {
        setVerificationStatus("CONFIRMED");
        setVerificationProgress(100);

        setEvents((current) => [
            ["NOW", "Compromise confidence reached 93%", "AI"],
            ["NOW", "N-07 confirmed unreliable", "SECURITY"],
            ["NOW", "Isolation initiated", "AI"],
            ...current,
        ]);

        // AUTONOMOUS ISOLATION
        addScenarioTimer(() => {
            setNodes((current) =>
            current.map((node) =>
                node.id === "N-07"
                ? {
                    ...node,
                    status: "ISOLATED",
                    trust: 0,
                    }
                : node
            )
            );

            setEvents((current) => [
                ["NOW", "N-07 isolated from critical mesh", "SECURITY"],
                ["NOW", "Critical routes recalculated", "ROUTER"],
                ...current,
                ]);

                // SELF-HEALING MESH
                addScenarioTimer(() => {
                    setMeshRecovery(true);

                    setEvents((current) => [
                        ["NOW", "Mesh failure detected around N-07", "NETWORK"],
                        ["NOW", "Searching for alternate communication path", "AI"],
                        ["NOW", "N-02 → N-03 → N-05 route discovered", "ROUTER"],
                        ["NOW", "Self-healing mesh activated", "SYSTEM"],
                        ["NOW", "Network connectivity restored", "SYSTEM"],
                        ...current,
                    ]);
                }, 1800);

                }, 1200);

        }, 3600);
    } else if (type === "NODE_FAILURE") {

        setNodes((current) =>
            current.map((node) =>
            node.id === "N-04"
                ? {
                    ...node,
                    status: "OFFLINE",
                    trust: 0,
                }
                : node
            )
        );

        setSelectedNode("N-04");

        setEvents([
            ["NOW", "N-04 stopped responding", "NETWORK"],
            ["NOW", "Primary communication path lost", "ROUTER"],
            ["NOW", "Searching for alternate route", "AI"],
            ...baseEvents,
        ]);

        // Simulate autonomous mesh recovery
        setTimeout(() => {
            setMeshRecovery(true);

            setEvents((current) => [
            ["NOW", "Alternate route discovered", "AI"],
            ["NOW", "N-02 → N-03 → N-05 route activated", "ROUTER"],
            ["NOW", "Mesh connectivity restored", "SYSTEM"],
            ...current,
            ]);
        }, 1800);
    } else {
      setNodes(initialNodes);
      setEvents(
        type === "FLOOD"
          ? [
              ["NOW", "Water level rising rapidly", "N-02"],
              ["NOW", "Sector B marked critical", "SCOUT"],
              ["NOW", "Rescue route optimization started", "RESCUE"],
              ...baseEvents,
            ]
          : baseEvents
      );
    }
  };

  const runIncident = () => {
    setScenario("FLOOD");
    setIncidentRunning(true);
    setIncidentStep(0);
    setNodes(initialNodes);
    setEvents([
      ["00:00", "Cyclone telemetry received", "N-02"],
    ]);
  };

  useEffect(() => {
    if (!incidentRunning) return;

    const timer = setInterval(() => {
      setIncidentStep((step) => {
        const next = step + 1;

        if (next === 1) {
          setEvents((e) => [
            ["00:04", "Flood probability reached 78%", "SCOUT"],
            ...e,
          ]);
        }

        if (next === 2) {
          setEvents((e) => [
            ["00:08", "N-07 submitted conflicting telemetry", "N-07"],
            ...e,
          ]);
        }

        if (next === 3) {
        setVerificationStatus("DETECTING");
        setVerificationProgress(15);

        setEvents((e) => [
            ["00:12", "Trust engine detected disagreement", "TRUST"],
            ["00:13", "Autonomous verification triggered", "AI"],
            ...e,
        ]);

        setNodes((current) =>
            current.map((node) =>
            node.id === "N-07"
                ? {
                    ...node,
                    trust: 18,
                    status: "COMPROMISED",
                }
                : node
            )
        );

        setSelectedNode("N-07");
        }

        if (next === 4) {
        setVerificationStatus("VERIFYING");
        setVerificationProgress(45);

        setEvents((e) => [
            ["00:16", "N-03 dispatched for independent verification", "N-03"],
            ["00:17", "Peer telemetry comparison started", "AI"],
            ...e,
        ]);
        }

        if (next === 5) {
            setVerificationStatus("CONFIRMED");
            setVerificationProgress(100);

            setEvents((e) => [
                ["00:20", "Compromise confidence reached 93%", "AI"],
                ["00:21", "N-07 confirmed unreliable", "SECURITY"],
                ["00:22", "N-07 isolated from critical routes", "SECURITY"],
                ...e,
            ]);

            setNodes((current) =>
                current.map((node) =>
                node.id === "N-07"
                    ? {
                        ...node,
                        trust: 0,
                        status: "ISOLATED",
                    }
                    : node
                )
            );

            setScenario("CYBER_ATTACK");
            setSelectedNode("N-07");
            }

        if (next === 6) {
          setEvents((e) => [
            ["00:24", "Self-healing mesh route established", "ROUTER"],
            ...e,
          ]);
        }

        if (next >= 7) {
          setEvents((e) => [
            ["00:28", "Rescue route optimized — incident stabilized", "AI"],
            ...e,
          ]);

          setIncidentRunning(false);
          return 7;
        }

        return next;
      });
    }, 1600);

    return () => clearInterval(timer);
  }, [incidentRunning]);

  return (
    <div className="command-center">

      {/* TOP NAVIGATION */}

      <header className="top-nav">

        <div className="brand">
          <div className="brand-mark">
            <Globe2 size={20} />
          </div>

          <div>
            <div className="brand-name">DISASTERMESH</div>
            <div className="brand-subtitle">
              AUTONOMOUS DISASTER INTELLIGENCE
            </div>
          </div>
        </div>

        <div className="incident-header">
          <div className="incident-id">
            INCIDENT <strong>#DM-2047</strong>
          </div>

          <div className={`severity-pill ${activeScenario.color}`}>
            <span />
            {activeScenario.label}
          </div>
        </div>

        <div className="top-actions">
          <div className="mesh-live">
            <span className="pulse-dot" />
            MESH ONLINE
          </div>

          <div className="top-time">
            AUTONOMOUS MODE
          </div>
        </div>

      </header>

      {/* MAIN GRID */}

      <main className="main-grid">

        {/* LEFT COMMAND SIDEBAR */}

        <aside className="left-rail">

          <section className="rail-section mission-section">

            <div className="section-label">
              <Crosshair size={14} />
              INCIDENT OVERVIEW
            </div>

            <div className="severity-number">
              {activeScenario.severity}
              <span>%</span>
            </div>

            <div className="severity-label">
              THREAT SEVERITY
            </div>

            <div className="severity-bar">
              <div
                style={{
                  width: `${activeScenario.severity}%`,
                }}
              />
            </div>

            <div className="overview-grid">

              <div>
                <span>ZONE</span>
                <strong>{activeScenario.zone}</strong>
              </div>

              <div>
                <span>STATUS</span>
                <strong>ACTIVE</strong>
              </div>

              <div>
                <span>PEOPLE AT RISK</span>
                <strong>142</strong>
              </div>

              <div>
                <span>SECTORS</span>
                <strong>08</strong>
              </div>

            </div>

          </section>

          <section className="rail-section">

            <div className="section-label">
              <Activity size={14} />
              NETWORK HEALTH
            </div>

            <div className="health-row">
              <div className="health-value">
                {networkHealth}%
              </div>

              <div className="health-caption">
                RESILIENCE
              </div>
            </div>

            <div className="mini-stats">

              <div>
                <Radio size={13} />
                <span>18 / 20</span>
                <small>NODES</small>
              </div>

              <div>
                <Bot size={13} />
                <span>20</span>
                <small>AGENTS</small>
              </div>

              <div>
                <Route size={13} />
                <span>3.2x</span>
                <small>REDUNDANCY</small>
              </div>

            </div>

          </section>

          <section className="rail-section">

            <div className="section-label">
              <Database size={14} />
              RESPONSE RESOURCES
            </div>

            <div className="resource-row">
              <Truck size={14} />
              <span>Rescue Units</span>
              <strong>{resources.rescue}</strong>
            </div>

            <div className="resource-row">
              <Eye size={14} />
              <span>Recon Drones</span>
              <strong>{resources.drones}</strong>
            </div>

            <div className="resource-row">
              <HeartPulse size={14} />
              <span>Medical Kits</span>
              <strong>{resources.medical}</strong>
            </div>

          </section>

          <section className="rail-section">

            <div className="section-label">
              <Shield size={14} />
              SECURITY
            </div>

            <div className="security-status">
              <ShieldCheck />
              <div>
                <strong>
                  {scenario === "CYBER_ATTACK"
                    ? "THREAT DETECTED"
                    : "PROTECTED"}
                </strong>

                <span>
                  {scenario === "CYBER_ATTACK"
                    ? "Containment active"
                    : "No active compromise"}
                </span>
              </div>
            </div>

          </section>

        </aside>

        {/* MAP */}

        <section className="map-stage">

          <div className="map-topbar">

            <div>
              <div className="map-heading">
                LIVE SWARM MAP
              </div>

              <div className="map-description">
                Distributed situational awareness • No central dependency
              </div>
            </div>

            <div className="map-controls">
              <button className="map-control active">
                <Globe2 size={13} />
                SWARM
              </button>

              <button className="map-control">
                <Navigation size={13} />
                ROUTES
              </button>
            </div>

          </div>

          <div className="map-canvas">

            <div className="map-grid" />

            <div className="map-scanline" />

            <div
              className={`danger-field ${activeScenario.color}`}
            >
              <div className="field-label">
                <AlertTriangle size={13} />
                {scenario === "FLOOD"
                  ? "CRITICAL FLOOD ZONE"
                  : "HIGH RISK SECTOR"}
              </div>
            </div>

            {/* ROUTES */}

            <div className="route-line route-a" />
            <div className="route-line route-b" />

            {!meshRecovery && (
            <>
                <div className="route-line route-c" />
                <div className="route-line route-d" />
            </>
            )}

            {meshRecovery && (
            <>
                <div className="route-line recovery-route-one" />
                <div className="route-line recovery-route-two" />

                <div className="route-recovery-label">
                <Route size={12} />
                SELF-HEALING ROUTE ACTIVE
                </div>
            </>
            )}

            {/* DATA PACKETS */}

            <div className="data-packet packet-a" />
            <div className="data-packet packet-b" />
            <div className="data-packet packet-c" />

            {/* NODES */}

            {nodes.map((node) => (
              <button
                key={node.id}
                className={`map-node ${
                  node.status === "COMPROMISED"
                    ? "compromised"
                    : node.status === "OFFLINE"
                      ? "offline"
                      : node.status === "VERIFYING"
                        ? "verifying"
                        : ""
                } ${selectedNode === node.id ? "selected" : ""}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                onClick={() => setSelectedNode(node.id)}
              >
                <span className="node-ring">
                  {node.status === "OFFLINE" ? (
                    <WifiOff size={16} />
                  ) : node.short === "DRONE" ? (
                    <Eye size={16} />
                  ) : node.short === "RESCUE" ? (
                    <Truck size={16} />
                  ) : (
                    <Radio size={16} />
                  )}
                </span>

                <span className="node-label">
                  {node.id}
                </span>

                <span className="node-type">
                  {node.short}
                </span>
              </button>
            ))}

            {/* LIVE MAP TELEMETRY */}
            <div className="map-telemetry">

            <div className="map-telemetry-card">
                <span>NODES ONLINE</span>
                <strong>{nodes.filter((node) => node.status !== "OFFLINE").length}/20</strong>
            </div>

            <div className="map-telemetry-card">
                <span>NETWORK</span>
                <strong>
                {scenario === "NODE_FAILURE" ? "88.7%" : "91.4%"}
                </strong>
            </div>

            <div
                className={`map-telemetry-card ${
                scenario === "CYBER_ATTACK" ? "danger" : ""
                }`}
            >
                <span>THREAT</span>
                <strong>
                {scenario === "CYBER_ATTACK"
                    ? "HIGH"
                    : scenario === "NODE_FAILURE"
                    ? "MED"
                    : "LOW"}
                </strong>
            </div>

            <div className="map-telemetry-card">
                <span>LATENCY</span>
                <strong>
                {scenario === "NODE_FAILURE" ? "47ms" : "32ms"}
                </strong>
            </div>

            </div>

            {/* INCIDENT MARKER */}

            <div className="incident-marker">
              <div className="marker-pulse" />
              <div className="marker-core">
                <Siren size={18} />
              </div>

              <div className="marker-label">
                <strong>SECTOR B</strong>
                <span>ACTIVE INCIDENT</span>
              </div>
            </div>

            {/* RESCUE TARGET */}

            <div className="rescue-target">
              <div>
                <Users size={15} />
              </div>

              <span>
                142 CIVILIANS
                <small>EVACUATION PRIORITY</small>
              </span>
            </div>

            {/* MAP LEGEND */}

            <div className="map-legend">

              <span>
                <i className="legend-dot node-online" />
                AGENT
              </span>

              <span>
                <i className="legend-dot node-warning" />
                VERIFYING
              </span>

              <span>
                <i className="legend-dot node-danger" />
                THREAT
              </span>

              <span>
                <i className="legend-line" />
                MESH LINK
              </span>

            </div>

          </div>

          {/* SCENARIO CONTROLS */}

          <div className="scenario-console">

            <div className="console-title">
              <Cpu size={14} />
              SIMULATION LAB
            </div>

            <div className="scenario-buttons">

              <button
                className={scenario === "NORMAL" ? "active" : ""}
                onClick={() => runScenario("NORMAL")}
              >
                NORMAL
              </button>

              <button
                className={scenario === "FLOOD" ? "active" : ""}
                onClick={() => runScenario("FLOOD")}
              >
                FLOOD
              </button>

              <button
                className={scenario === "CYBER_ATTACK" ? "active danger" : ""}
                onClick={() => runScenario("CYBER_ATTACK")}
              >
                CYBER ATTACK
              </button>

              <button
                className={scenario === "NODE_FAILURE" ? "active warning" : ""}
                onClick={() => runScenario("NODE_FAILURE")}
              >
                NODE FAILURE
              </button>

              <button
                className="run-incident"
                onClick={runIncident}
                disabled={incidentRunning}
              >
                <Sparkles size={13} />
                {incidentRunning
                  ? "INCIDENT RUNNING"
                  : "RUN AUTONOMOUS INCIDENT"}
              </button>

            </div>

          </div>

        </section>

        {/* RIGHT INTELLIGENCE PANEL */}

        <aside className="right-command">

            {/* AI COMMAND CENTER */}
            <section className="compact-ai-header">

                <div className="compact-ai-title">

                <div className="ai-icon">
                    <Sparkles size={16} />
                </div>

                <div>
                    <span>AI COMMAND CENTER</span>
                    <small>AUTONOMOUS DECISION ENGINE</small>
                </div>

                </div>

                <div className="ai-status">
                <span />
                ACTIVE
                </div>

            </section>


            {/* CURRENT DECISION */}
            <section className="command-card">

                <div className="compact-label">
                CURRENT DECISION
                </div>

                <div className="compact-decision-row">

                <strong>
                    {scenario === "CYBER_ATTACK"
                    ? "CONTAIN N-07"
                    : scenario === "NODE_FAILURE"
                        ? "REROUTE MESH"
                        : scenario === "FLOOD"
                        ? "OPTIMIZE EVACUATION"
                        : "MONITOR NETWORK"}
                </strong>

                <span>
                    {scenario === "CYBER_ATTACK"
                    ? "93%"
                    : scenario === "FLOOD"
                        ? "89%"
                        : "97%"}
                </span>

                </div>

                <p>{activeScenario.title}</p>

            </section>


            {/* ACTIVE AGENT */}
            <section className="command-card">

                <div className="compact-label">
                ACTIVE AGENT
                </div>

                <div className="agent-compact">

                <div className="agent-compact-icon">
                    <Radio size={16} />
                </div>

                <div className="agent-compact-main">

                    <strong>N-07</strong>

                    <span
                    className={
                        selected?.status === "ISOLATED"
                        ? "status-isolated"
                        : selected?.status === "COMPROMISED"
                            ? "status-compromised"
                            : "status-online"
                    }
                    >
                    {selected?.status || "ONLINE"}
                    </span>

                </div>

                <div className="compact-trust">

                    <small>TRUST</small>

                    <strong>
                    {selected?.trust ?? 0}%
                    </strong>

                </div>

                </div>


                {/* VERIFICATION */}
                <div className="response-row">

                <div className="response-icon">
                    <ShieldCheck size={13} />
                </div>

                <div>
                    <span>VERIFICATION</span>

                    <strong>
                    {verificationStatus === "CONFIRMED"
                        ? "CONFIRMED"
                        : verificationStatus === "IDLE"
                        ? "STANDBY"
                        : verificationStatus}
                    </strong>
                </div>

                <b>
                    {verificationStatus === "CONFIRMED"
                    ? "93%"
                    : `${verificationProgress}%`}
                </b>

                </div>


                {/* SECURITY ACTION */}
                <div className="response-row">

                <div className="response-icon">
                    <ShieldAlert size={13} />
                </div>

                <div>
                    <span>SECURITY ACTION</span>

                    <strong>
                    {selected?.status === "ISOLATED"
                        ? "N-07 ISOLATED"
                        : "MONITORING"}
                    </strong>
                </div>

                <b>
                    {selected?.status === "ISOLATED"
                    ? "DONE"
                    : "—"}
                </b>

                </div>

            </section>


            {/* NETWORK RESPONSE */}
            <section className="command-card">

                <div className="compact-label">
                NETWORK RESPONSE
                </div>

                <div className="network-response-status">

                <div>

                    <span>MESH STATUS</span>

                    <strong>
                    {meshRecovery
                        ? "SELF-HEALING ACTIVE"
                        : "MESH ONLINE"}
                    </strong>

                </div>

                <Route size={17} />

                </div>


                <div className="response-route">

                <span>ACTIVE ROUTE</span>

                <strong>
                    {meshRecovery
                    ? "N-02 → N-03 → N-05"
                    : "N-01 → N-02 → N-05"}
                </strong>

                </div>


                <div className="network-metrics">

                <div>
                    <span>SCORE</span>

                    <strong>
                    {meshRecovery ? "91.4" : "89.7"}
                    </strong>
                </div>

                <div>
                    <span>RISK</span>

                    <strong className="low-risk">
                    LOW
                    </strong>
                </div>

                <div>
                    <span>LATENCY</span>

                    <strong>
                    {meshRecovery ? "47ms" : "42ms"}
                    </strong>
                </div>

                </div>

            </section>


            {/* AUTONOMOUS CHAIN */}
            <section className="command-card">

                <div className="compact-label">
                AUTONOMOUS RESPONSE
                </div>

                <div className="chain">

                <div className="chain-step">

                    <span className="chain-dot done" />

                    <span>DETECT</span>

                </div>

                <div className="chain-line" />

                <div className="chain-step">

                    <span
                    className={`chain-dot ${
                        verificationStatus === "CONFIRMED"
                        ? "done"
                        : "active"
                    }`}
                    />

                    <span>VERIFY</span>

                </div>

                <div className="chain-line" />

                <div className="chain-step">

                    <span
                    className={`chain-dot ${
                        selected?.status === "ISOLATED"
                        ? "done"
                        : "active"
                    }`}
                    />

                    <span>ISOLATE</span>

                </div>

                <div className="chain-line" />

                <div className="chain-step">

                    <span
                    className={`chain-dot ${
                        meshRecovery
                        ? "done"
                        : "active"
                    }`}
                    />

                    <span>REROUTE</span>

                </div>

                </div>

            </section>

            </aside>
      </main>

      {/* BOTTOM TIMELINE */}

      <footer className="event-timeline">

        <div className="timeline-heading">
          <div>
            <div className="timeline-title">
              <Activity size={14} />
              INCIDENT TIMELINE
            </div>

            <div className="timeline-subtitle">
              LIVE AGENT ACTIVITY
            </div>
          </div>

          <div className="event-count">
            {events.length} EVENTS
          </div>
        </div>

        <div className="timeline-events">

          {events.slice(0, 6).map((event, index) => (
            <div
              className="timeline-event"
              key={`${event[0]}-${event[1]}-${index}`}
            >
              <span className="event-time">
                {event[0]}
              </span>

              <span className="event-dot">
                <CircleDot size={9} />
              </span>

              <div>
                <strong>{event[1]}</strong>
                <small>{event[2]}</small>
              </div>
            </div>
          ))}

        </div>

      </footer>

    </div>
  );
}

export default App;