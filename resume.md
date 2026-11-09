# Percy Yeung

New York, NY

(470) 424-7179

percy@percyyeung.com

linkedin.com/in/percyyeung

## Summary

Systems engineer working in Rust and Go, specializing in networking and infrastructure tooling. Built the Cloudflare One Appliance (a mission-critical edge system for enterprises with dozens of branch offices) and the management tooling, out-of-band access, and public-facing API infrastructure behind it.

## Professional Experience

**Cloudflare** | New York, NY

_Systems Engineer_ | 2023 - 2026

- Built the appliance agent, the core Rust software that serves as the device's control plane - a fully concurrent, event-driven engine on the Tokio runtime - managing the networking stack down to DHCP, NAT, and NTP and configuring an immutable, read-only OS with a persistent partition for device state. Led the creation of several of its subsystems:
  - Serial console CLI: wrote ping and traceroute from the ground up in Rust to run natively over the device's VRF-based network infrastructure, with live port status and configuration reporting that surfaces misconfigurations and unexpected device behavior.
  - Out-of-band reverse shell access over cloudflared tunnels, a reverse-tunnel path for remote diagnosis that cuts time-to-resolution for field issues.
  - Application-aware traffic shaping: solution that allows the configuration of custom handling of east-west traffic, as well as traffic to/from specified subnets, hostnames, and well-known applications, using DNS-based interception as the control point.
- Built diagnostic AI (opencode) skills that aggregate internal APIs and telemetry sources, replacing the multiple manual API calls with a streamlined way of diagnosing problems and creating reports by simply asking the LLM.
- Tailored the Linux kernel configuration for the Buildroot-based device image, adapting it to our hardware and use cases.
- Regularly extend the platform's Go APIs with new endpoints and features across the public/internal APIs (user and dashboard configuration flows) and the protobuf-based controller API that agents on deployed appliances connect to; the APIs are stateless and freely restartable, with both the Postgres deployment and the API fleet replicated across three data centers in two cities for disaster recovery and failover.
- Migrated and evolved the Postgres schema behind fleet device and configuration state - a routine part of shipping features, including converting legacy JSON blob columns to typed, queryable columns.
- Expanded our ClickHouse and Graph API platforms to widen what data we captured, and built Grafana dashboards to visualize this telemetry.
- Managed our product's infrastructure running on Cloudflare products as well as Kubernetes using Terraform.
- Built the update cohort system that classifies devices into rollout rings, managing artifacts and the CI/CD pipelines that build and deploy each new version across the fleet in stages.
- Helped grow a small-team greenfield network appliance program to a fleet of over 500 active customer devices, each capable of multi-gigabit throughput.
- Built local security features for the SASE appliance: password policies, secure erase, and password change/reset flows, including the login and password UI. Shipped as part of the appliance's SASE features, behind Cloudflare One's recognition as a Visionary in the Gartner Magic Quadrant for SASE Platforms (2025, 2026).

**CodeMettle** | Atlanta, GA

_Associate Principal Software Development Engineer, DevOps_ | 2022 - 2023

_IT Manager_ | 2020 - 2022

_Senior Engineer_ | 2019 - 2020

_Software Engineer_ | 2018 - 2019

_Associate Software Engineer_ | 2015 - 2016

- Rebuilt the company network as CodeMettle grew from a ~30-person office to a 150+ employee workspace, including a complete office relocation: greenfield fiber and Ethernet plant, dedicated lab/data-center space, and hands-on ownership of power budgets, cooling, layout, and installation.
- Evolved the network from a small-office setup to a CMMC-compliant environment, implementing Pritunl VPN access and company-wide identity and access management across Azure Active Directory and on-premises environments.
- Designed and built portable site-to-site "VPN in a box" devices for sales engineers and employees with little networking expertise, simplifying access from conventions and remote sites to internal lab datacenters over technologies including ZeroTier.
- Managed a team of 4 engineers and architected secure cloud infrastructure on Microsoft Azure.
- Administered the Proxmox virtualization platform, automating template deployment for scaling and integrating Active Directory for user permissions and quota management.
- Designed and built Azure-based security infrastructure and military tactical network simulation environments with realistic failure modes for compliance training and red-team exercises.
- Led DevOps automation across hybrid cloud and on-premises environments, and managed production website infrastructure including TLS/PKI certificate management and DNS configuration.

**Georgia Institute of Technology** | Atlanta, GA

_Cyber Security Analyst_ | 2016 - 2017

- Performed digital forensics, vulnerability analysis, and network security monitoring in a research lab environment.

## Technical Skills

- **Languages:** Rust, Go
- **Networking & Infrastructure:** AWS, Azure, Kubernetes, Terraform, Proxmox, VLANs, VRF, DHCP, NAT, DNS, VPN, WireGuard
- **Observability & Data:** ClickHouse, Prometheus, Grafana
- **Developer Tooling:** Protobuf, GitLab CI/CD, TeamCity, HashiCorp Vault, Buildroot
- **Spoken Languages:** English, Cantonese, Mandarin, Russian (Elementary)

## Education

**Georgia Institute of Technology** | Atlanta, GA

_Bachelor of Science in Computer Engineering_ | 2013 - 2018

- **GPA:** 3.84 Major / 3.73 Cumulative
