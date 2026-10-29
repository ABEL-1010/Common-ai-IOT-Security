# Use Case Innovation Canvas

## OUR IDEA IN ONE SENTENCE
> **We help** enterprise IoT fleet managers and retail/facility operators **address** unpredictable cyberattacks on neglected, non-monetary IoT/OT devices **with** an autonomous 24/7 AI Red Team model served as a subscription product, **to achieve** zero unscheduled IoT/OT downtime and complete elimination of non-monetary exploit blind spots.

---

## Context (Why, and for whom?)

### 01 | Problem & target group
* **Target Group:** Enterprise IoT managers, retail chain operators, and facility managers handling large deployments of non-monetary IoT/OT hardware (e.g., HVAC, commercial refrigeration, smart sensors).
* **Problem:** These devices are routinely neglected during security audits because they do not store financial data. However, they are easily exploited by "lulz/fun" hackers for chaotic, physical disruption (e.g., forcing defrost cycles on supermarket freezers).
* **Current Status:** Today, companies rely on infrequent (annual) human penetration tests or basic static scanners that completely miss non-monetary, non-standard logic vulnerabilities on peripheral IoT assets.

### 02 | Importance & impact
* **Resource & Financial Cost:** A single IoT attack (like the French supermarket freezer incident) causes hundreds of thousands of euros in spoiled inventory, physical asset damage, and emergency IT remediation.
* **Operational Risk:** Physical disruption to critical peripheral infrastructure threatens food safety, public trust, and business continuity.
* **Estimated Risk Figure:** Millions of euros lost per chain annually across unmonitored IoT fleets, plus catastrophic reputational damage during high-profile physical hacks.

### 03 | Desired outcome
* **Measurable Improvement:** Proactive discovery and patching of non-monetary IoT zero-days before external exploitation occurs.
* **Success Metric:** 100% automated coverage of connected IoT/OT nodes with a 0% physical downtime rate resulting from unauthorized IoT configuration changes.

---

## Concept (What do we propose?)

### 04 | Solution & innovation
* **What do we propose?**  
  An autonomous **AI-as-a-Service (AIaaS) Red Team** delivered as a subscription product that continuously probes, fuzzes, and tests non-monetary IoT/OT devices (e.g., commercial freezers, HVACs, building controls) for non-standard logic vulnerabilities.
* **What makes it better?**  
  Traditional static scanners and annual human pentests miss non-monetary logic flaws. Our system runs 24/7 autonomous threat simulation and, upon detecting a critical zero-day or matching CVE, triggers an automated physical air-gap fail-safe (severing remote network access while keeping the local hardware running physically on manual/local defaults with 0% operational downtime).
* **Role of AI, Defence, and Sustainability:**
  * **AI:** Generates unpredictable, non-linear attack vectors that mimic chaotic "fun/lulz" hackers.
  * **Defence:** Delivers continuous proactive defense for critical, neglected peripheral infrastructure.
  * **Sustainability:** Prevents catastrophic physical destruction, such as tons of spoiled food inventory and energy waste caused by manipulated cooling/heating systems.

### 05 | User scenario
* **Step 1: Input (Detection & Continuous Red Teaming)**  
  A new IoT device/update is deployed to the fleet. The cloud AI Red Team automatically launches simulated attacks against the node, while monitoring global CVE feeds for matching software/hardware flaws.
* **Step 2: Use (AI Attack & Fail-Safe Trigger)**  
  The AI discovers a logic vulnerability (or a critical CVE is published). To prevent external exploitation, the system automatically triggers the local Network Kill-Switch via an edge gateway, isolating the controller from the internet while dropping it into Local Physical Mode.
* **Step 3: Result (Zero Physical Downtime)**  
  The physical asset (e.g., supermarket freezer) remains running safely offline on local controls without stopping or spoiling inventory. An automated alert and patch recommendations are sent to the facility IT manager.

### 06 | What do we show today?
* **What have we developed, tested, or simulated?**
  * Simulated a chaotic "fun/lulz" exploit payload against a commercial refrigeration/IoT controller endpoint.
  * Demonstrated the AI Red Team agent's ability to detect the unauthenticated control command.
  * Tested an automated air-gap network isolation script that severs external cloud connectivity while maintaining local device telemetry and physical operation.
* **What can we substantiate?**
  * Proof of Concept showing that isolating network communication does not disrupt core physical functions (0% physical downtime achieved).
  * Architecture diagram for cloud AI compute paired with local edge gateway enforcement.
* **What is out of scope?**
  * Automatic hardware-level firmware rebuilding for proprietary legacy microcontrollers (remediation is handled via air-gap isolation + alerting, rather than automated live code rewriting).

---

## Implications (What does it take, and what does it deliver?)

### 07 | Feasibility & resources
* **Which data, technology, expertise, and partners?**
  * **Technology & Data:** Cloud AI compute infrastructure, generative AI / Red Team agent frameworks, global CVE databases/APIs, containerized edge gateways, and standard IoT/OT communication protocols (e.g., MQTT, Modbus).
  * **Expertise:** Cybersecurity (penetration testing & red teaming), IoT/OT protocol engineering, and cloud AI systems architecture.
  * **Partners:** Enterprise IT/OT integration partners (such as Cegeka) and facility management operators.
* **What exists already?**
  * Public vulnerability feeds (NVD/CVE APIs), foundational AI agent architectures, and standard edge gateway hardware.
* **What do we depend on?**
  * Client permission to deploy a secure edge gateway on their local network and read-access to peripheral device controllers.

### 08 | Risks & assumptions
* **Assumption 1 (False Positive Isolation):** We assume the system will never trigger an accidental false-positive network kill-switch that disrupts normal operations.
  * *Mitigation:* Implement a staged rollout with "soft-isolation" alerts and threshold verification before executing full automated air-gapping.
* **Assumption 2 (Proprietary OT Legacy Systems):** We assume diverse, legacy hardware vendors will allow interoperability with our edge software.
  * *Mitigation:* Use vendor-agnostic, containerized protocol adapters that sit safely on the network boundary without altering core device firmware.
* **Assumption 3 (Destructive AI Simulation):** We assume the autonomous AI Red Team won't send an uncalculated, damaging payload during live testing.
  * *Mitigation:* Run all AI-generated attack scripts within a sandboxed digital twin or isolated staging network segment first.

### 09 | First field test & scaling
* **What is the smallest test, with whom, and when?**
  * A 2-week pilot deploying a single edge gateway and our AI monitoring agent on a small cluster (5–10 nodes) of non-critical IoT/refrigeration test units, conducted in collaboration with a local facility partner or lab environment.
* **What cost and effort?**
  * Minimal hardware cost (standard industrial mini-PC/edge box) and moderate software effort focused on configuring the CVE-matching script and AI Red Team loop.
* **What changes at scale?**
  * Transitioning from manual edge installations to automated, zero-touch cloud provisioning across thousands of multi-site enterprise facilities, requiring robust multi-tenant cloud AI infrastructure and centralized fleet management dashboards.