import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Radio,
  ShieldCheck,
  Wifi,
  Zap,
  X,
} from "lucide-react";
import "./App.css";

const nodes = [
  {
    id: "N-01",
    type: "Emergency Station",
    trust: 98,
    status: "ONLINE",
    agent: "Monitoring",
  },
  {
    id: "N-02",
    type: "Drone",
    trust: 96,
    status: "ONLINE",
    agent: "Scanning flood zone",
  },
  {
    id: "N-03",
    type: "Rescue Vehicle",
    trust: 91,
    status: "ONLINE",
    agent: "Verifying N-07",
  },
  {
    id: "N-07",
    type: "Unknown Device",
    trust: 42,
    status: "UNSTABLE",
    agent: "Conflicting reports",
  },
];

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [simulation, setSimulation] = useState("NORMAL");
  const [eventMessage, setEventMessage] = useState(
    "Network operating normally"
  );
  const [attackMode, setAttackMode] = useState(false);
  const [trustN07, setTrustN07] = useState(42);
  const [isolated, setIsolated] = useState(false);

  const runSimulation = (type) => {
    setSimulation(type);

    if (type === "NORMAL") {
      setAttackMode(false);
      setIsolated(false);
      setTrustN07(42);

      setEventMessage(
        "Network operating normally."
      );
    }

    if (type === "FLOOD") {
      setAttackMode(false);
      setIsolated(false);
      setTrustN07(42);

      setEventMessage(
        "Flood detected. Agents are mapping affected zones and calculating rescue routes."
      );
    }

    if (type === "NODE_FAILURE") {
      setAttackMode(false);
      setIsolated(false);

      setEventMessage(
        "N-04 connection lost. Mesh agents are rerouting communication."
      );
    }

    if (type === "CYBER_ATTACK") {
      setAttackMode(true);
      setIsolated(false);
      setTrustN07(18);

      setEventMessage(
        "N-07 is behaving abnormally. Independent agents are verifying the node."
      );

      setTimeout(() => {
        setIsolated(true);

        setEventMessage(
          "Verification complete. N-07 isolated. Mesh automatically rerouted."
        );
      }, 2500);
    }
  };

  return (
    <div className="app">

      {/* TOP BAR */}
      <header className="topbar">
        <div>
          <div className="logo">DISASTERMESH</div>
          <div className="subtitle">
            AUTONOMOUS DISASTER RESPONSE NETWORK
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          SYSTEM ONLINE
        </div>
      </header>

      {/* DASHBOARD */}
      <main className="dashboard">

        {/* LEFT */}
        <aside className="panel left-panel">

          <div className="panel-title">
            <Activity size={17} />
            NETWORK STATUS
          </div>

          <div className="big-status">98.7%</div>
          <div className="muted">NETWORK HEALTH</div>

          <div className="stat">
            <span>ACTIVE NODES</span>
            <strong>18 / 20</strong>
          </div>

          <div className="stat">
            <span>ACTIVE AGENTS</span>
            <strong>20</strong>
          </div>

          <div className="stat">
            <span>TRUST SCORE</span>
            <strong>94%</strong>
          </div>

          <div className="panel-title threat-title">
            <ShieldCheck size={17} />
            THREAT MONITOR
          </div>

          <div className="threat safe">
            <span></span>
            No active threats
          </div>

          <div className="threat">
            <AlertTriangle size={15} />
            Node N-07 unstable
          </div>

          <div className="threat">
            <Wifi size={15} />
            Internet connectivity lost
          </div>

        </aside>

        {/* MAP */}
        <section className="map-panel">

          <div className="map-header">
            <div>
              <div className="map-title">
                LIVE DISASTER MAP
              </div>

              <div className="muted">
                Autonomous swarm intelligence
              </div>
            </div>

            <div className="live">
              <span className="status-dot"></span>
              LIVE
            </div>
          </div>

          <div className="map">

            <div className="simulation-bar">

            <div className="simulation-label">
              <Zap size={15} />
              SIMULATION CONTROL
            </div>

            <button onClick={() => runSimulation("NORMAL")}>
              NORMAL
            </button>

            <button onClick={() => runSimulation("FLOOD")}>
              FLOOD
            </button>

            <button onClick={() => runSimulation("NODE_FAILURE")}>
              NODE FAILURE
            </button>

            <button onClick={() => runSimulation("CYBER_ATTACK")}>
              CYBER ATTACK
            </button>

          </div>

            <div className="grid"></div>

            <div className="danger-zone"></div>

            <div className="connection c1"></div>
            <div className="connection c2"></div>
            <div className="connection c3"></div>
            <div className="connection c4"></div>

            {/* NODE 1 */}
            <button
              className="node n1"
              onClick={() => setSelectedNode(nodes[0])}
            >
              <Radio size={18} />
              <span>N-01</span>
            </button>

            {/* NODE 2 */}
            <button
              className="node n2"
              onClick={() => setSelectedNode(nodes[1])}
            >
              <Radio size={18} />
              <span>N-02</span>
            </button>

            {/* NODE 3 */}
            <button
              className="node n3"
              onClick={() => setSelectedNode(nodes[2])}
            >
              <Radio size={18} />
              <span>N-03</span>
            </button>

            {/* NODE 7 */}
            <button
              className={`node n4 ${
                isolated
                  ? "isolated-node"
                  : attackMode
                  ? "attack-node"
                  : "warning-node"
              }`}
              onClick={() => setSelectedNode(nodes[3])}
            >
              <Radio size={18} />
              <span>N-07</span>
            </button>

            {/* DISASTER */}
            <div className="disaster">
              <AlertTriangle size={24} />
              <span>FLOOD ZONE</span>
            </div>

            {/* RESCUE */}
            <div className="rescue">
              <Zap size={18} />
              RESCUE TARGET
            </div>

          </div>
        </section>

        {/* RIGHT */}
        <aside className="panel right-panel">

          <div className="panel-title">
            <Zap size={17} />
            AI DECISION ENGINE
          </div>

          <div className="decision">

            <div className="decision-label">
              CURRENT SIMULATION
            </div>

            <h2>{simulation}</h2>

            <p>
              {isolated
                ? "N-07 has been isolated after independent verification. Communication routes have been automatically recalculated."
                : eventMessage}
            </p>

          </div>

          <div className="panel-title">
            <ShieldCheck size={17} />
            TRUST MATRIX
          </div>

          <div className="panel-title">
            <Zap size={17} />
            AGENT REASONING
          </div>

          <div className="reasoning">

            <div className="reasoning-step">
              <span className="reasoning-time">19:42</span>
              <div>
                <strong>Signal received</strong>
                <p>N-07 reported severe flooding.</p>
              </div>
            </div>

            <div className="reasoning-step">
              <span className="reasoning-time">19:43</span>
              <div>
                <strong>Confidence evaluated</strong>
                <p>Report conflicts with nearby agents.</p>
              </div>
            </div>

            <div className="reasoning-step">
              <span className="reasoning-time">19:43</span>
              <div>
                <strong>Trust adjusted</strong>
                <p>N-07 trust decreased to {trustN07}%.</p>
              </div>
            </div>

            <div className="reasoning-step">
              <span className="reasoning-time">19:44</span>
              <div>
                <strong>Verification requested</strong>
                <p>N-03 selected as independent verifier.</p>
              </div>
            </div>

            <div className="reasoning-step">
              <span className="reasoning-time">19:45</span>
              <div>
                <strong>
                  {isolated ? "Node isolated" : "Decision pending"}
                </strong>

                <p>
                  {isolated
                    ? "N-07 isolated and mesh routes recalculated."
                    : "Waiting for independent verification."}
                </p>
              </div>
            </div>

          </div>

          <div className="trust">

            {nodes.map((node) => (
              <div
                key={node.id}
                className={
                  node.trust < 60
                    ? "danger-trust"
                    : ""
                }
              >
                <span>{node.id}</span>
                <strong>
                  {node.id === "N-07" ? trustN07 : node.trust}%
                </strong>
              </div>
            ))}

          </div>

          <div className="panel-title">
            <Activity size={17} />
            LIVE EVENTS
          </div>

          <div className="events">

            <p>
              <b>19:42</b>
              N-07 reported flooding
            </p>

            <p>
              <b>19:43</b>
              Agent disagreement detected
            </p>

            <p>
              <b>19:43</b>
              N-03 dispatched
            </p>

            <p>
              <b>19:44</b>
              Rescue route recalculated
            </p>

          </div>

        </aside>

      </main>

      {/* NODE DETAILS MODAL */}
      {selectedNode && (
        <div className="modal-overlay">

          <div className="node-modal">

            <button
              className="close-button"
              onClick={() => setSelectedNode(null)}
            >
              <X size={18} />
            </button>

            <div className="modal-icon">
              <Radio size={28} />
            </div>

            <div className="modal-title">
              {selectedNode.id}
            </div>

            <div className="modal-type">
              {selectedNode.type}
            </div>

            <div className="modal-status">
              <span className="status-dot"></span>
              {selectedNode.status}
            </div>

            <div className="modal-grid">

              <div>
                <span>TRUST SCORE</span>
                <strong>{selectedNode.trust}%</strong>
              </div>

              <div>
                <span>AI AGENT</span>
                <strong>{selectedNode.agent}</strong>
              </div>

            </div>

            <div className="agent-message">
              <ShieldCheck size={16} />
              Agent intelligence verified
            </div>

          </div>

        </div>
      )}

      {/* FOOTER */}
      <footer>
        <span>DISASTERMESH v0.1</span>
        <span>
          DECENTRALIZED • AUTONOMOUS • RESILIENT
        </span>
      </footer>

    </div>
  );
}

export default App;