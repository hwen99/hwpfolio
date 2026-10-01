---
id: global-server-load-balancer-concept-guide
title: "Concept guide: Global server load balancing"
summary: Making complex networking concepts clear through structure and diagrams.
type: case-study
status: professional
audience:
  - Network and security engineers
  - IT administrators
tools:
  - MadCap Flare
  - Obsidian
  - Figma
---

Conceptual documentation · Information architecture 

---

### Overview

- **Role:** Sole Technical Writer
- **Deliverable:** Concept guide
- **Audience:** Network and security engineers, IT administrators
- **Tools:** MadCap Flare, Obsidian, Figma
- **Timeline:** Proposed Fall 2025 · Initial approval Jan 2026 · Content direction approved Mar 2026 · Completed Jul 2026
- **Business context:** The guide was developed for a growing product area, with sales of bundles including GSLB up 47% year over year.

### The challenge

FortiAppSec Cloud is primarily a cloud-based web application firewall, with GSLB available under certain contracts. Existing documentation covered individual features and settings, but users lacked a unified explanation of how traffic distribution, health monitoring, DNS, and security work together.

I proposed a dedicated concept guide and initial table of contents to provide that foundation before users moved into configuration. Development progressed in stages alongside higher-priority release documentation.

### My approach

I independently planned, structured, and wrote the GSLB Concept Guide, creating all supporting visuals in Figma and consulting product SMEs to clarify system behavior and validate technical accuracy.

Key decisions included:

- **Organizing the guide from general concepts to specific applications.** Started with an overview, introduced core functionality, and then explored practical use cases.
- **Explaining system behavior through visuals and examples.** Used diagrams, comparisons, and scenarios to show how GSLB components and behaviors interact.
- **Connecting use cases to configuration choices.** Compared deployment scenarios and outlined recommended configurations, helping readers choose an approach before moving into detailed setup instructions.

#### Featured Sections

- **Explaining layered routing logic**
I separated traffic distribution into the two decision stages—selecting a virtual server pool, then selecting a server within that pool—and used scenarios and diagrams to explain how each stage affects routing.
    
    ![DNS-query-origin routing map with server pools in North America, Europe, and Asia-Pacific.](assets/dns-query.png)
    
    [Read: Load Distribution Methods →](https://docs.fortinet.com/document/fortiappsec-cloud/26.3.0/gslb-concept-guide/577773/load-distribution-methods)
    
- **Distinguishing related features**
    
    Health checks help determine which servers can receive traffic, while synthetic testing provides visibility into application availability and performance.
    
    I introduced their shared purpose, compared their behavior, and then explained each workflow with diagrams to help readers understand when to use each feature and how both fit into GSLB’s monitoring functionality.
    
    ![Comparison table contrasting GSLB health checks and synthetic testing.](assets/application-visibility.png)
    
    ![Health check flow from background server probes to a DNS response identifying a healthy server.](assets/health-check.png)
    
    ![Synthetic testing flow showing endpoint probes and status reporting without changing DNS responses.](assets/synthetic-testing.png)
    
    [Read: Health Check and Synthetic Testing →](https://docs.fortinet.com/document/fortiappsec-cloud/26.3.0/gslb-concept-guide/605549/health-check-and-synthetic-testing)
    
- **Guiding deployment decisions**
    
    I introduced an uneven inbound-traffic problem, explained how DNS-based routing addresses it, and distinguished the deployment from VPN scaling and multisite load balancing. This helps readers recognize when the approach fits their environment.
    
    ![GSLB and FortiGate SD-WAN integration diagram showing DNS selection among three ISP links.](assets/sd-wan-diagram.png)
    
    [Read: FortiGate Integration for SD-WAN Inbound Optimization →](https://docs.fortinet.com/document/fortiappsec-cloud/26.3.0/gslb-concept-guide/321153/fortigate-integration-for-sd-wan-inbound-optimization)
    

### Early impact

Positive feedback from customers and sales teams indicated that the guide was useful in supporting product understanding and sales conversations.
