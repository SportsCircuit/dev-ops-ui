import { Tool, Category } from "@/types";

export const categories: Category[] = [
  "All",
  "Observability",
  "Logging",
  "Metrics",
  "Tracing",
  "Container",
  "CI/CD",
  "Messaging",
  "Database",
  "Documentation",
  "Frontend",
  "Health",
];

export const tools: Tool[] = [
  // Logging
  {
    id: "kibana",
    name: "Kibana",
    description: "Centralized logging and visualization for ELK stack.",
    category: "Logging",
    environments: ["Dev", "QA", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    id: "splunk",
    name: "Splunk",
    description: "Enterprise operational intelligence and logging.",
    category: "Logging",
    environments: ["Prod"],
    status: "healthy",
    url: "#",
  },

  // Metrics
  {
    id: "grafana",
    name: "Grafana",
    description: "Metrics visualization and dashboards.",
    category: "Metrics",
    environments: ["Dev", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    id: "prometheus",
    name: "Prometheus",
    description: "Time-series database for monitoring metrics.",
    category: "Metrics",
    environments: ["Dev", "Prod"],
    status: "healthy",
    url: "#",
  },

  // Tracing
  {
    id: "jaeger",
    name: "Jaeger",
    description: "End-to-end distributed tracing.",
    category: "Tracing",
    environments: ["Dev", "QA", "Prod"],
    status: "healthy",
    url: "#",
  },

  // Container
  {
    id: "kubernetes-dashboard",
    name: "Kubernetes Dashboard",
    description: "Web-based Kubernetes user interface.",
    category: "Container",
    environments: ["Dev", "QA", "Stage", "Prod"],
    status: "warning",
    url: "#",
  },
  {
    id: "openshift",
    name: "RHz OpenShift",
    description: "Enterprise Kubernetes container platform.",
    category: "Container",
    environments: ["Prod"],
    status: "healthy",
    url: "#",
  },

  // CI/CD
  {
    id: "jenkins",
    name: "Jenkins",
    description: "Automation server for building and deploying.",
    category: "CI/CD",
    environments: ["Dev", "QA", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    id: "argocd",
    name: "ArgoCD",
    description: "Declarative GitOps continuous delivery tool for Kubernetes.",
    category: "CI/CD",
    environments: ["Dev", "Prod"],
    status: "healthy",
    url: "#",
  },

  // Messaging
  {
    id: "kafka-manager",
    name: "Kafka Manager (AKHQ)",
    description: "GUI for Apache Kafka to manage topics and consumers.",
    category: "Messaging",
    environments: ["Dev", "QA", "Prod"],
    status: "healthy",
    url: "#",
  },

  // Documentation
  {
    id: "confluence",
    name: "Confluence",
    description: "Team collaboration and documentation.",
    category: "Documentation",
    environments: ["Prod"],
    status: "healthy",
    url: "#",
  },
  {
    id: "swagger-ui",
    name: "Swagger UI",
    description: "API documentation and testing.",
    category: "Documentation",
    environments: ["Dev", "QA", "Prod"],
    status: "healthy",
    url: "#",
  },

  // Frontend
  {
    id: "sentry",
    name: "Sentry",
    description: "Frontend error tracking and performance monitoring.",
    category: "Frontend",
    environments: ["Prod"],
    status: "healthy",
    url: "#",
  },

  // Health
  {
    id: "uptime-kuma",
    name: "Uptime Kuma",
    description: "Self-hosted monitoring tool.",
    category: "Health",
    environments: ["Prod"],
    status: "healthy",
    url: "#",
  },
];
