---
id: authentication-proxy-feature
title: "Feature documentation: Authentication Proxy"
summary: Explaining authentication flows, configuration, and edge cases.
type: case-study
status: professional
audience:
  - Network and security engineers
  - IT administrators
tools:
  - MadCap Flare
  - Figma
---

New feature documentation · Configuration guidance

---

## Overview

- **Role:** Sole Technical Writer
- **Deliverables:** New feature documentation and in-product feature announcement
- **Audience:** Network and security engineers, IT administrators
- **Tools:** MadCap Flare, Figma
- **Collaboration:** Product management, engineering SMEs, UX

## The challenge

The new Authentication Proxy feature required users to understand how FortiAppSec Cloud, external identity providers, and origin applications work together through SAML or OIDC. The documentation needed to connect individual settings to the overall authentication flow and help users adapt the configuration to their own application requirements. 

## My approach

I combined feature specifications, Teams discussions, UI designs, and SME input to understand the feature, identify missing information, and organize the documentation around customer goals.

Key decisions included:

- **Visualizing the end-to-end authentication flow.** Iterated on the relationships between the browser, FortiAppSec Cloud, the identity provider, and the origin application before creating the final sequence diagram.
    
    ![Authentication Proxy sequence connecting the browser, identity provider, FortiAppSec Cloud, and origin servers.](assets/auth-proxy.png)
    
- **Establishing the mental model before configuration.** Explained FortiAppSec Cloud’s role as the service provider and distinguished SAML from OIDC before introducing protocol-specific settings.
    
    ![Supported Authentication Protocols excerpt explaining service-provider and identity-provider roles in SAML and OIDC.](assets/auth-protocols.png)
    
- **Placing explanations at decision points.** Kept conceptual guidance alongside the settings where users needed it to understand their configuration choices.
    
    ![Authentication rule setup guidance covering protocol tabs, priority order, and a SAML prerequisite.](assets/auth-rules.png)
    
- **Highlighting dependencies and exceptions.** Documented identity provider prerequisites, conditional settings, objects configured on separate pages, and cases such as domains using nondefault ports.
    
    ![Authentication rule settings for enabling rules, selecting path-match types, and using domains with nondefault ports.](assets/auth-settings.png)
    
- **Explaining security controls through behavior and examples.** Showed how account lockout, session limits, and credential-stuffing defense work so readers could understand the effects of these settings.
    
    ![Account lockout and per-user session limit settings with a failed-login threshold example.](assets/auth-details.png)
    

[Read: Authentication Proxy →](https://docs.fortinet.com/document/fortiappsec-cloud/latest/user-guide/356340/authentication-proxy)
