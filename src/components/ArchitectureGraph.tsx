import { useMemo, useState, useCallback } from "react";
import type { Microservice, DependencyType } from "@/types";

/* ─── Colour palettes ─────────────────────────────────── */

const depTypeColors: Record<
  DependencyType,
  { bg: string; border: string; text: string }
> = {
  Database: { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
  Cache: { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
  External: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
  Microservice: { bg: "#faf5ff", border: "#a855f7", text: "#6b21a8" },
  MessageQueue: { bg: "#fff7ed", border: "#f97316", text: "#9a3412" },
  Storage: { bg: "#fefce8", border: "#eab308", text: "#854d0e" },
};

const statusColors: Record<string, string> = {
  healthy: "#22c55e",
  maintenance: "#eab308",
  degraded: "#f97316",
  down: "#ef4444",
};

/* ─── Types ───────────────────────────────────────────── */

interface DepNode {
  key: string;
  name: string;
  type: DependencyType;
  connectedServiceIndices: number[];
}

interface ArchitectureGraphProps {
  services: Microservice[];
}

/* ─── Component ───────────────────────────────────────── */

export default function ArchitectureGraph({
  services,
}: ArchitectureGraphProps) {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [hoveredDep, setHoveredDep] = useState<string | null>(null);

  /* Deduplicated dependency list */
  const depNodes = useMemo<DepNode[]>(() => {
    const map = new Map<string, DepNode>();
    services.forEach((svc, svcIdx) => {
      svc.dependencies?.forEach((dep) => {
        const key = `${dep.name}::${dep.type}`;
        const existing = map.get(key);
        if (existing) {
          existing.connectedServiceIndices.push(svcIdx);
        } else {
          map.set(key, {
            key,
            name: dep.name,
            type: dep.type,
            connectedServiceIndices: [svcIdx],
          });
        }
      });
    });
    return Array.from(map.values());
  }, [services]);

  /* ── Layout constants ── */
  const svcX = 20;
  const svcW = 250;
  const svcH = 64;
  const svcGap = 24;
  const labelY = 24;
  const colStartY = 50;

  const depW = 240;
  const depH = 48;
  const depGap = 16;

  const hasDeps = depNodes.length > 0;
  const svgW = hasDeps ? 920 : svcW + svcX * 2;
  const depX = hasDeps ? 660 : 0;

  /* Dynamic height */
  const svcColH = services.length * (svcH + svcGap) - svcGap;
  const depColH = hasDeps ? depNodes.length * (depH + depGap) - depGap : 0;
  const contentH = Math.max(svcColH, depColH);
  const svgH = contentH + colStartY + 30; /* 30 = bottom padding */

  /* Vertically centre the shorter column */
  const svcOffsetY = colStartY + Math.max(0, (contentH - svcColH) / 2);
  const depOffsetY = colStartY + Math.max(0, (contentH - depColH) / 2);

  /* ── Coordinate helpers ── */
  const svcRightCenter = (idx: number) => ({
    x: svcX + svcW,
    y: svcOffsetY + idx * (svcH + svcGap) + svcH / 2,
  });

  const depLeftCenter = (idx: number) => ({
    x: depX,
    y: depOffsetY + idx * (depH + depGap) + depH / 2,
  });

  /* ── Edges ── */
  const edges = useMemo(() => {
    const result: { svcIdx: number; depIdx: number; depKey: string }[] = [];
    depNodes.forEach((dep, depIdx) => {
      dep.connectedServiceIndices.forEach((svcIdx) => {
        result.push({ svcIdx, depIdx, depKey: dep.key });
      });
    });
    return result;
  }, [depNodes]);

  /* Highlight logic */
  const isAnythingHovered = hoveredService !== null || hoveredDep !== null;

  const isEdgeHighlighted = useCallback(
    (svcIdx: number, depKey: string) => {
      if (hoveredService !== null) return svcIdx === hoveredService;
      if (hoveredDep !== null) return depKey === hoveredDep;
      return false;
    },
    [hoveredService, hoveredDep],
  );

  const isSvcHighlighted = useCallback(
    (idx: number) => {
      if (hoveredService !== null) return idx === hoveredService;
      if (hoveredDep !== null) {
        const dep = depNodes.find((d) => d.key === hoveredDep);
        return dep?.connectedServiceIndices.includes(idx) ?? false;
      }
      return false;
    },
    [hoveredService, hoveredDep, depNodes],
  );

  const isDepHighlighted = useCallback(
    (depKey: string) => {
      if (hoveredDep !== null) return depKey === hoveredDep;
      if (hoveredService !== null) {
        const dep = depNodes.find((d) => d.key === depKey);
        return dep?.connectedServiceIndices.includes(hoveredService) ?? false;
      }
      return false;
    },
    [hoveredService, hoveredDep, depNodes],
  );

  /* ── Empty state ── */
  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-[#717182] bg-white border border-black/8 rounded-lg">
        <p className="text-sm">No microservices to display.</p>
      </div>
    );
  }

  /* ── Truncate helper for SVG text ── */
  const truncate = (text: string, maxLen: number) =>
    text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;

  return (
    <div className="bg-white border border-black/8 rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full"
          style={{ minHeight: Math.min(svgH, 500), maxHeight: 700 }}
          aria-label="Service architecture dependency graph"
          role="img"
        >
          {/* ── Defs ────────────────────────────────────── */}
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
            </marker>
            <marker
              id="arrow-active"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#2b7fff" />
            </marker>
            <filter
              id="node-shadow"
              x="-4%"
              y="-4%"
              width="108%"
              height="108%"
            >
              <feDropShadow
                dx="0"
                dy="1"
                stdDeviation="2"
                floodOpacity="0.08"
              />
            </filter>
          </defs>

          {/* ── Column labels ───────────────────────────── */}
          <text
            x={svcX}
            y={labelY}
            fontSize={11}
            fontWeight={700}
            fill="#717182"
            letterSpacing={1}
          >
            SERVICES
          </text>
          {hasDeps && (
            <text
              x={depX}
              y={labelY}
              fontSize={11}
              fontWeight={700}
              fill="#717182"
              letterSpacing={1}
            >
              DEPENDENCIES
            </text>
          )}

          {/* ── Edges (drawn first so nodes sit on top) ── */}
          {edges.map(({ svcIdx, depIdx, depKey }) => {
            const start = svcRightCenter(svcIdx);
            const end = depLeftCenter(depIdx);
            const midX = (start.x + end.x) / 2;
            const highlighted = isEdgeHighlighted(svcIdx, depKey);
            const dimmed = isAnythingHovered && !highlighted;

            return (
              <path
                key={`${svcIdx}-${depKey}`}
                d={`M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`}
                fill="none"
                stroke={highlighted ? "#2b7fff" : "#cbd5e1"}
                strokeWidth={highlighted ? 2 : 1.5}
                opacity={dimmed ? 0.12 : 1}
                markerEnd={highlighted ? "url(#arrow-active)" : "url(#arrow)"}
                style={{ transition: "opacity 200ms, stroke 200ms" }}
              />
            );
          })}

          {/* ── Service nodes ───────────────────────────── */}
          {services.map((svc, idx) => {
            const x = svcX;
            const y = svcOffsetY + idx * (svcH + svcGap);
            const highlighted = isSvcHighlighted(idx);
            const dimmed = isAnythingHovered && !highlighted;

            return (
              <g
                key={svc.id}
                onMouseEnter={() => setHoveredService(idx)}
                onMouseLeave={() => setHoveredService(null)}
                className="cursor-pointer"
                opacity={dimmed ? 0.3 : 1}
                style={{ transition: "opacity 200ms" }}
              >
                <rect
                  x={x}
                  y={y}
                  width={svcW}
                  height={svcH}
                  rx={10}
                  fill="white"
                  stroke={highlighted ? "#2b7fff" : "#e2e8f0"}
                  strokeWidth={highlighted ? 2 : 1}
                  filter="url(#node-shadow)"
                />
                {/* Status indicator */}
                <circle
                  cx={x + 18}
                  cy={y + svcH / 2}
                  r={5}
                  fill={statusColors[svc.status] ?? "#94a3b8"}
                />
                {/* Service name */}
                <text
                  x={x + 32}
                  y={y + svcH / 2 - 6}
                  fontSize={13}
                  fontWeight={600}
                  fill="#0a0a0a"
                >
                  {truncate(svc.name, 28)}
                </text>
                {/* Owner · Version */}
                <text
                  x={x + 32}
                  y={y + svcH / 2 + 12}
                  fontSize={11}
                  fill="#717182"
                >
                  {truncate(svc.owner, 18)} · {svc.version}
                </text>
              </g>
            );
          })}

          {/* ── Dependency nodes ─────────────────────────── */}
          {depNodes.map((dep, idx) => {
            const x = depX;
            const y = depOffsetY + idx * (depH + depGap);
            const colors = depTypeColors[dep.type];
            const highlighted = isDepHighlighted(dep.key);
            const dimmed = isAnythingHovered && !highlighted;

            return (
              <g
                key={dep.key}
                onMouseEnter={() => setHoveredDep(dep.key)}
                onMouseLeave={() => setHoveredDep(null)}
                className="cursor-pointer"
                opacity={dimmed ? 0.3 : 1}
                style={{ transition: "opacity 200ms" }}
              >
                <rect
                  x={x}
                  y={y}
                  width={depW}
                  height={depH}
                  rx={8}
                  fill={colors.bg}
                  stroke={highlighted ? "#2b7fff" : colors.border}
                  strokeWidth={highlighted ? 2 : 1}
                  filter="url(#node-shadow)"
                />
                {/* Type colour bar on left edge */}
                <rect
                  x={x}
                  y={y + 4}
                  width={4}
                  height={depH - 8}
                  rx={2}
                  fill={colors.border}
                />
                {/* Dependency name */}
                <text
                  x={x + 16}
                  y={y + depH / 2 - 4}
                  fontSize={12}
                  fontWeight={600}
                  fill={colors.text}
                >
                  {truncate(dep.name, 26)}
                </text>
                {/* Type label */}
                <text
                  x={x + 16}
                  y={y + depH / 2 + 12}
                  fontSize={10}
                  fill={colors.text}
                  opacity={0.7}
                >
                  {dep.type}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Legend ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 border-t border-black/8 text-[11px] text-[#717182]">
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Legend
        </span>

        {/* Dependency types */}
        {Object.entries(depTypeColors).map(([type, colors]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: colors.border }}
            />
            {type}
          </span>
        ))}

        {/* Separator + service statuses */}
        <span className="ml-1 border-l border-black/10 pl-3 flex items-center gap-3">
          {Object.entries(statusColors).map(([status, color]) => (
            <span
              key={status}
              className="flex items-center gap-1.5 capitalize"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: color }}
              />
              {status}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
