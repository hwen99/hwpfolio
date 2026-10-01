---
id: web-application-firewall-onboarding-workflow
title: "Onboarding documentation: Web application firewall"
summary: Guiding security setup with clear steps and decision context.
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

Procedural documentation · Configuration guidance 

---

### Overview

- **Role:** Sole Technical Writer
- **Deliverable:** End-to-end WAF onboarding documentation
- **Audience:** Network and security engineers, IT administrators
- **Tools:** MadCap Flare, Obsidian, Figma
- **Timeline:** Originally published January 2024 · Restructured July 2026 for Flare → Markdown migration
- **Collaboration:** Product management, engineering SMEs, UX

### The challenge

Onboarding a WAF application requires decisions about domains, origin servers, traffic routing, CDN behavior, security settings, and DNS. Some choices are difficult or impossible to reverse later.

The documentation needed to connect configuration steps with their consequences and explain the work required outside the product, including firewall prerequisites and DNS changes. Users needed enough context to make informed decisions and complete the full onboarding process.

### My approach

I structured the documentation around the user's complete onboarding journey. 

Key decisions included: 

- **Establishing the end-to-end mental model.** Introduced how traffic flows through FortiAppSec Cloud before asking users to configure the application.
    
    ![FortiAppSec Cloud traffic-flow diagram showing load balancing, WAF inspection, and attack blocking.](assets/waf-onboarding-diagram.png)
    
- **Adding context at decision points.** Explained the consequences of choices such as CDN enablement, cloud platform selection, and scrubbing-center selection instead of simply defining the controls. For example, the documentation distinguishes cost/compliance considerations from user-experience considerations when choosing CDN behavior.
    
    ![WAF onboarding guidance for CDN scope, cloud platform selection, and scrubbing-center settings.](assets/cdn.png)
    
- **Extending the documentation beyond the product UI.** Explained the external DNS work required to actually route production traffic through the WAF, including different requirements for root and non-root domains.
    
    ![DNS setup excerpt covering connectivity testing and separate instructions for root and non-root domains.](assets/cname-ss.png)
    
- **Documenting consequential edge cases.** Added dedicated guidance for multi-port applications, including a comparison of normal and multi-port onboarding and warnings about inherited CDN/region settings.
    
    ![Normal and multi-port WAF onboarding comparison, with a warning about inherited CDN and region settings.](assets/multiports.png)
    

[Read: WAF Onboarding Wizard →](https://docs.fortinet.com/document/fortiappsec-cloud/latest/user-guide/032019/waf-onboarding-wizard)
