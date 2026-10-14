export interface GrafanaMetricItem {
  id: string;
  name: string;
  promql: string;
  currentValue: string;
  unit: string;
  badge: string;
  trend: string;
  trendType: "good" | "neutral" | "warning";
  dataPoints: number[];
}

export interface GrafanaCategory {
  id: string;
  label: string;
  iconName: "database" | "cpu" | "server" | "storage";
  description: string;
  metrics: GrafanaMetricItem[];
}

export const GRAFANA_CATEGORIES: GrafanaCategory[] = [
  {
    id: "performance",
    label: "Database & Queries",
    iconName: "database",
    description: "PostgreSQL transaction throughput, query execution latency, active locks, and query cache efficiency.",
    metrics: [
      {
        id: "query-latency",
        name: "Avg Query Latency",
        promql: "rate(pg_stat_database_xact_commit[1m])",
        currentValue: "0.82",
        unit: "ms",
        badge: "P95 1.4ms",
        trend: "-12% vs last hr",
        trendType: "good",
        dataPoints: [1.2, 1.1, 0.95, 0.88, 0.92, 0.84, 0.82],
      },
      {
        id: "tps-throughput",
        name: "Transaction Throughput",
        promql: "sum(rate(pg_stat_database_xact_commit[5m]))",
        currentValue: "148",
        unit: "TPS",
        badge: "Healthy",
        trend: "+5.4% traffic",
        trendType: "good",
        dataPoints: [110, 125, 138, 142, 139, 145, 148],
      },
      {
        id: "cache-hit-ratio",
        name: "Buffer Cache Hit Ratio",
        promql: "pg_stat_database_blks_hit / (pg_stat_database_blks_hit + pg_stat_database_blks_read)",
        currentValue: "99.85",
        unit: "%",
        badge: "Target >99%",
        trend: "Optimal RAM caching",
        trendType: "good",
        dataPoints: [99.7, 99.8, 99.82, 99.84, 99.83, 99.85, 99.85],
      },
      {
        id: "active-locks",
        name: "Row & Table Locks",
        promql: "count(pg_locks{granted=\"true\"})",
        currentValue: "3",
        unit: "locks",
        badge: "0 Deadlocks",
        trend: "Low contention",
        trendType: "good",
        dataPoints: [8, 6, 4, 5, 2, 4, 3],
      },
    ],
  },
  {
    id: "compute",
    label: "Compute & Resources",
    iconName: "cpu",
    description: "Postgres compute instance utilization, memory allocation, and disk read/write IOPS.",
    metrics: [
      {
        id: "cpu-util",
        name: "Database CPU Utilization",
        promql: "node_cpu_utilization",
        currentValue: "14.2",
        unit: "%",
        badge: "2 vCPU Pool",
        trend: "-3.1% idle surge",
        trendType: "good",
        dataPoints: [22, 18, 15, 19, 16, 13, 14.2],
      },
      {
        id: "memory-usage",
        name: "RAM Allocated / Shared Buffers",
        promql: "node_memory_Active_bytes / node_memory_MemTotal_bytes",
        currentValue: "264",
        unit: "MB",
        badge: "1 GB Plan",
        trend: "26.4% capacity",
        trendType: "good",
        dataPoints: [240, 248, 252, 258, 260, 262, 264],
      },
      {
        id: "disk-iops",
        name: "Disk Read / Write IOPS",
        promql: "rate(node_disk_read_bytes_total[1m]) + rate(node_disk_written_bytes_total[1m])",
        currentValue: "24",
        unit: "IOPS",
        badge: "Burst 3000",
        trend: "Sub-millisecond disk",
        trendType: "good",
        dataPoints: [18, 22, 35, 28, 20, 26, 24],
      },
      {
        id: "disk-capacity",
        name: "Storage Volume Available",
        promql: "node_filesystem_free_bytes / node_filesystem_size_bytes",
        currentValue: "92.6",
        unit: "%",
        badge: "SSD NVMe",
        trend: "7.4 GB used of 100 GB",
        trendType: "good",
        dataPoints: [93.1, 93.0, 92.9, 92.8, 92.7, 92.6, 92.6],
      },
    ],
  },
  {
    id: "pooler",
    label: "Connection Pooler",
    iconName: "server",
    description: "PgBouncer client pool saturation, transaction pooling efficiency, and connection queuing.",
    metrics: [
      {
        id: "active-clients",
        name: "Active Client Connections",
        promql: "sum(pg_stat_activity_count{state=\"active\"})",
        currentValue: "12",
        unit: "clients",
        badge: "Max 100",
        trend: "12% connection load",
        trendType: "good",
        dataPoints: [8, 14, 16, 11, 9, 13, 12],
      },
      {
        id: "idle-in-tx",
        name: "Idle in Transaction",
        promql: "count(pg_stat_activity{state=\"idle in transaction\"})",
        currentValue: "0",
        unit: "queries",
        badge: "0 Stalled",
        trend: "Zero hanging sessions",
        trendType: "good",
        dataPoints: [0, 1, 0, 0, 0, 0, 0],
      },
      {
        id: "pool-waiting",
        name: "Clients Waiting for Pool",
        promql: "pgbouncer_pools_cl_waiting",
        currentValue: "0",
        unit: "queued",
        badge: "Zero Latency",
        trend: "Instant pool routing",
        trendType: "good",
        dataPoints: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        id: "connection-churn",
        name: "Connection Churn Rate",
        promql: "rate(pg_stat_database_numbackends[5m])",
        currentValue: "2.8",
        unit: "/ min",
        badge: "PgBouncer",
        trend: "Pooled reuse rate",
        trendType: "good",
        dataPoints: [4.2, 3.8, 3.1, 2.9, 3.4, 2.6, 2.8],
      },
    ],
  },
  {
    id: "storage",
    label: "WAL & Replication",
    iconName: "storage",
    description: "Write-Ahead Log (WAL) generation cadence, auto-vacuum bloat cleanup, and backup replication health.",
    metrics: [
      {
        id: "wal-rate",
        name: "WAL Generation Rate",
        promql: "rate(pg_stat_database_xact_commit[5m]) * 1024",
        currentValue: "1.4",
        unit: "MB/m",
        badge: "Continuous",
        trend: "Stable checkpointing",
        trendType: "good",
        dataPoints: [1.8, 1.6, 1.3, 1.5, 1.4, 1.2, 1.4],
      },
      {
        id: "table-bloat",
        name: "Estimated Table Bloat",
        promql: "pg_stat_user_tables_n_dead_tup / pg_stat_user_tables_n_live_tup",
        currentValue: "0.3",
        unit: "%",
        badge: "Auto-Vacuum",
        trend: "Dead tuples purged",
        trendType: "good",
        dataPoints: [1.2, 0.9, 0.7, 0.5, 0.4, 0.3, 0.3],
      },
      {
        id: "replication-lag",
        name: "Physical Replication Lag",
        promql: "pg_replication_slots_active",
        currentValue: "0",
        unit: "ms",
        badge: "Synchronous",
        trend: "Zero standby skew",
        trendType: "good",
        dataPoints: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        id: "vacuum-workers",
        name: "Active Vacuum Workers",
        promql: "count(pg_stat_activity{query=~\"autovacuum.*\"})",
        currentValue: "1",
        unit: "worker",
        badge: "Maintenance",
        trend: "Background optimization",
        trendType: "neutral",
        dataPoints: [1, 2, 1, 1, 2, 1, 1],
      },
    ],
  },
];
