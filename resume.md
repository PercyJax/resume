# Percy Yeung

New York, NY
(470) 424-7179
percy@percyyeung.com
linkedin.com/in/percyyeung

## Summary

Systems engineer working in Rust and Go, specializing in infrastructure tooling, networking, and developer platforms. Built and operated the Cloudflare One Appliance (a mission-critical edge system for enterprises with dozens of branch offices), including its management tooling, out-of-band access, and public-facing API infrastructure.

## Professional Experience

**Cloudflare** | New York, NY
_Systems Engineer_ | 2023 - 2026

- Co-developed the appliance agent, the core Rust software that serves as the device's control plane, managing the entire networking stack down to DHCP, NAT, and NTP and configuring an immutable, read-only OS with a persistent partition for device state. Led several of its subsystems:
  - Serial console CLI: a controlled terminal for running custom diagnostics like ping and traceroute over the device's VRF-based network infrastructure, alongside live port status and configuration reporting that surfaces misconfigurations and unexpected device behavior.
  - Out-of-band reverse shell access over cloudflared tunnels, letting engineers remotely diagnose deployed appliances and cutting time-to-resolution for field issues.
  - Application-aware traffic shaping: solution that allows the configuration of custom handling of east-west traffic, as well as traffic to/from specified subnets, hostnames, and well-known applications.
- Built diagnostic AI (opencode) skills that aggregate internal APIs and telemetry sources, replacing the multiple manual API calls with a streamlined way of diagnosing problems and creating reports by simply asking the LLM.
- Tailored the Linux kernel configuration for the Buildroot-based device image, adapting it to our hardware and use cases.
- Contributed to the platform's Go APIs, adding features to both the public/internal APIs (which serves all users and dashboard configuration flows) and the protobuf-based controller API that agents on deployed appliances connect to.
- Expanded the telemetry platform, adding new columns to the ClickHouse and Graph API schemas to widen what we capture, and built Grafana dashboards to visualize the data.
- Managed our team's infrastructure with Terraform: the Cloudflare provider to configure our own resources using Cloudflare products, and the Kubernetes provider to manage other internal infrastructure hosted in Cloudflare's core datacenters.
- Built the update cohort system that classifies devices into rollout rings (engineers' test devices, internal employee dogfood tinkerers, Cloudflare office locations around the world, and production customer devices), managing artifacts and the CI/CD pipelines that build and deploy each new version across the fleet in stages.
- Helped grow a greenfield appliance program from a small team to a fleet of over 500 active devices, each capable of multi-gigabit throughput.
- Contributed to the SASE features and requirements delivered through the appliance (security, management, routing, firewalling, and branch connectivity), behind Cloudflare One's recognition as a Visionary in the Gartner Magic Quadrant for SASE Platforms (2025, 2026).

**CodeMettle** | Atlanta, GA
_Associate Principal Software Development Engineer, DevOps_ | 2022 - 2023
_IT Manager_ | 2020 - 2022
_Senior Engineer_ | 2019 - 2020
_Software Engineer_ | 2018 - 2019
_Associate Software Engineer_ | 2015 - 2016

- Rebuilt the company network as CodeMettle grew from a ~30-person office to a 150+ employee workspace, including a complete office relocation: greenfield fiber and Ethernet plant, dedicated lab/data-center space, and hands-on ownership of power budgets, cooling, layout, and installation.
- Evolved the network from a small-office setup to a CMMC-compliant environment, implementing VPN access and company-wide identity and access management across Azure Active Directory and on-premises environments.
- Managed a team of 4 engineers and architected secure cloud infrastructure on Microsoft Azure.
- Administered the Proxmox virtualization platform, automating template deployment for scaling and integrating Active Directory for user permissions and quota management.
- Designed and built Azure-based security infrastructure and military tactical network simulation environments with realistic failure modes for compliance training and red-team exercises.
- Led DevOps automation across hybrid cloud and on-premises environments, and managed production website infrastructure including TLS/PKI certificate management and DNS configuration.

**Georgia Institute of Technology** | Atlanta, GA
_Cyber Security Analyst_ | 2016 - 2017

- Performed digital forensics, vulnerability analysis, and network security monitoring in a research lab environment.

## Technical Skills

- **Languages:** Rust, Go
- **Networking & Infrastructure:** AWS, Azure, Kubernetes, Terraform, Proxmox, ECMP, link aggregation, VLANs
- **Observability & Data:** ClickHouse, Prometheus, Grafana
- **Developer Tooling:** Protobuf, GitLab CI/CD, TeamCity, HashiCorp Vault, Buildroot
- **Spoken Languages:** English, Cantonese, Mandarin, Russian (Elementary)

## Education

**Georgia Institute of Technology** | Atlanta, GA

_Bachelor of Science in Computer Engineering_ | 2013 - 2018

- **GPA:** 3.84 Major / 3.73 Cumulative
