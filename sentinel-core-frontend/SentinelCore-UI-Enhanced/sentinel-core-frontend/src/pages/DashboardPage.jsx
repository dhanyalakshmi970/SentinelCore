import { useEffect, useState } from 'react';

import AssetHealth from "../components/AssetHealth";

import {
 Activity,
 AlertTriangle,
 ArrowRight,
 CheckCircle2,
 RefreshCw,
 Server,
 ShieldAlert
} from '../components/Icons';

import {
 AreaChart,
 Area,
 CartesianGrid,
 ResponsiveContainer,
 Tooltip,
 XAxis,
 YAxis
} from 'recharts';

import {
 getAllAssets,
 getDashboardSummary
} from '../api/assetApi';

import {
 getAlerts,
 getIncidents,
 getVulnerabilities
} from '../api/securityApi';

import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import MetricBar from '../components/MetricBar';
import PageHeader from '../components/PageHeader';

import { useNavigate } from 'react-router-dom';


const seedTrend = [
 { time: '00:00', cpu: 34, memory: 42 },
 { time: '04:00', cpu: 39, memory: 46 },
 { time: '08:00', cpu: 48, memory: 53 },
 { time: '12:00', cpu: 44, memory: 51 },
 { time: '16:00', cpu: 58, memory: 61 },
 { time: '20:00', cpu: 52, memory: 56 },
 { time: 'Now', cpu: 47, memory: 54 }
];


export default function DashboardPage() {

 const [summary, setSummary] = useState({});
 const [assets, setAssets] = useState([]);
 const [alerts, setAlerts] = useState([]);
 const [incidents, setIncidents] = useState([]);
 const [vulns, setVulns] = useState([]);
 const [loading, setLoading] = useState(true);

 const navigate = useNavigate();


 const load = async () => {

  setLoading(true);

  try {

   const [
    s,
    a,
    al,
    i,
    v
   ] = await Promise.allSettled([
    getDashboardSummary(),
    getAllAssets(),
    getAlerts(),
    getIncidents(),
    getVulnerabilities()
   ]);


   if (s.status === 'fulfilled') {
    setSummary(s.value.data || {});
   }

   if (a.status === 'fulfilled') {
    setAssets(a.value.data || []);
   }

   if (al.status === 'fulfilled') {
    setAlerts(al.value.data || []);
   }

   if (i.status === 'fulfilled') {
    setIncidents(i.value.data || []);
   }

   if (v.status === 'fulfilled') {
    setVulns(v.value.data || []);
   }

  } finally {

   setLoading(false);

  }
 };


 useEffect(() => {
  load();
 }, []);


 const avgCpu =
     summary.avgCpuUsage ?? 0;

 const avgMem =
     summary.avgMemoryUsage ?? 0;

 const avgDisk =
     summary.avgDiskUsage ?? 0;

 const avgNetwork =
     assets.length
         ? assets.reduce(
         (total, asset) =>
             total + (Number(asset.networkUsage) || 0),
         0
     ) / assets.length
         : 0;


 return (
     <>

      {/* PAGE HEADER */}

      <PageHeader
          title="Security overview"
          description="Real-time visibility across your enterprise infrastructure and security posture."
          actions={
           <button
               className="btn secondary"
               onClick={load}
           >
            <RefreshCw size={16} />
            Refresh
           </button>
          }
      />


      {/* KPI CARDS */}

      <div className="kpi-grid">

       <KpiCard
           label="Total assets"
           value={
               summary.totalAssets ??
               assets.length
           }
           detail={`${
               summary.onlineAssets ??
               assets.filter(
                   a => a.status === 'ONLINE'
               ).length
           } online now`}
           icon={Server}
           tone="blue"
           onClick={() => navigate('/assets')}
       />


       <KpiCard
           label="Uptime"
           value={
            summary.uptimePercentage != null
                ? `${Number(
                    summary.uptimePercentage
                ).toFixed(1)}%`
                : '—'
           }
           detail="Infrastructure availability"
           icon={Activity}
           tone="green"
       />


       <KpiCard
           label="Critical alerts"
           value={
               summary.criticalAlerts ??
               alerts.filter(
                   a => a.severity === 'CRITICAL'
               ).length
           }
           detail="Require attention"
           icon={ShieldAlert}
           tone="red"
           onClick={() => navigate('/alerts')}
       />


       <KpiCard
           label="Open incidents"
           value={
            incidents.filter(
                i =>
                    !['RESOLVED', 'CLOSED']
                        .includes(i.status)
            ).length
           }
           detail={`${
               vulns.filter(
                   v =>
                       String(
                           v.patchStatus
                       ).toUpperCase() !== 'PATCHED'
               ).length
           } vulnerabilities open`}
           icon={AlertTriangle}
           tone="amber"
           onClick={() => navigate('/incidents')}
       />

      </div>


      {/* MAIN DASHBOARD */}

      <div className="dashboard-grid">


       {/* INFRASTRUCTURE UTILIZATION */}

       <section className="panel chart-panel">

        <div className="panel-head">

         <div>
          <h2>
           Infrastructure utilization
          </h2>

          <p>
           Average resource consumption across monitored assets
          </p>
         </div>

         <span className="live-pill">
              <span />
              LIVE
            </span>

        </div>


        <div className="chart-wrap">

         <ResponsiveContainer
             width="100%"
             height={280}
         >

          <AreaChart data={seedTrend}>

           <defs>

            <linearGradient
                id="cpuFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
            >

             <stop
                 offset="0%"
                 stopOpacity={0.22}
             />

             <stop
                 offset="100%"
                 stopOpacity={0}
             />

            </linearGradient>

           </defs>


           <CartesianGrid
               strokeDasharray="3 3"
               vertical={false}
           />

           <XAxis
               dataKey="time"
               axisLine={false}
               tickLine={false}
           />

           <YAxis
               axisLine={false}
               tickLine={false}
               unit="%"
           />

           <Tooltip />


           <Area
               type="monotone"
               dataKey="cpu"
               strokeWidth={2.5}
               fill="url(#cpuFill)"
               name="CPU"
           />


           <Area
               type="monotone"
               dataKey="memory"
               strokeWidth={2.5}
               fill="none"
               name="Memory"
           />

          </AreaChart>

         </ResponsiveContainer>

        </div>

       </section>


       {/* NEW COLORFUL ASSET HEALTH */}

       <AssetHealth assets={assets} />

      </div>


      {/* RESOURCE HEALTH + RECENT ALERTS */}

      <div className="dashboard-grid lower">


       {/* RESOURCE HEALTH */}

       <section className="panel">

        <div className="panel-head">

         <div>

          <h2>
           Resource health
          </h2>

          <p>
           Aggregate performance indicators
          </p>

         </div>

        </div>


        <MetricBar
            label="CPU utilization"
            value={avgCpu}
        />

        <MetricBar
            label="Memory utilization"
            value={avgMem}
        />

        <MetricBar
            label="Disk utilization"
            value={avgDisk}
        />

        <MetricBar
            label="Network utilization"
            value={avgNetwork}
        />

       </section>


       {/* RECENT ALERTS */}

       <section className="panel">

        <div className="panel-head">

         <div>

          <h2>
           Recent alerts
          </h2>

          <p>
           Latest open security signals
          </p>

         </div>


         <button
             className="text-btn"
             onClick={() => navigate('/alerts')}
         >
          Open center
          <ArrowRight size={15} />
         </button>

        </div>


        <div className="activity-list">

         {alerts
             .slice(0, 4)
             .map(a => (

                 <div
                     className="activity-item"
                     key={a.id}
                 >

                  <div
                      className={`activity-icon ${
                          String(
                              a.severity
                          ).toLowerCase()
                      }`}
                  >

                   <AlertTriangle
                       size={16}
                   />

                  </div>


                  <div className="activity-copy">

                   <b>
                    {
                        a.assetName ||
                        `Asset #${a.assetId}`
                    }
                   </b>

                   <span>
                      {a.message}
                    </span>

                  </div>


                  <StatusBadge
                      value={a.severity}
                  />

                 </div>

             ))}


         {!alerts.length && (
             <Empty
                 text="No open alerts. Your monitored environment is quiet."
                 icon={CheckCircle2}
             />
         )}

        </div>

       </section>

      </div>


      {/* MONITORED ASSETS */}

      <section className="panel">

       <div className="panel-head">

        <div>

         <h2>
          Monitored assets
         </h2>

         <p>
          Highest utilization requiring visibility
         </p>

        </div>


        <button
            className="text-btn"
            onClick={() =>
                navigate('/assets')
            }
        >
         Asset inventory
         <ArrowRight size={15} />
        </button>

       </div>


       <div className="table-wrap">

        <table>

         <thead>

         <tr>
          <th>Asset</th>
          <th>Type</th>
          <th>IP address</th>
          <th>CPU</th>
          <th>Memory</th>
          <th>Status</th>
         </tr>

         </thead>


         <tbody>

         {[...assets]
             .sort(
                 (a, b) =>
                     (b.cpuUsage || 0) -
                     (a.cpuUsage || 0)
             )
             .slice(0, 5)
             .map(a => (

                 <tr key={a.id}>

                  <td>

                   <div className="asset-cell">

                    <div className="table-icon">
                     <Server size={16} />
                    </div>

                    <b>
                     {a.assetName}
                    </b>

                   </div>

                  </td>


                  <td>
                   {a.assetType}
                  </td>


                  <td className="mono">
                   {a.ipAddress}
                  </td>


                  <td>
                   {Math.round(
                       a.cpuUsage || 0
                   )}%
                  </td>


                  <td>
                   {Math.round(
                       a.memoryUsage || 0
                   )}%
                  </td>


                  <td>
                   <StatusBadge
                       value={a.status}
                   />
                  </td>

                 </tr>

             ))}

         </tbody>

        </table>


        {!assets.length &&
            !loading && (

                <Empty
                    text="No assets found. Register an asset to start monitoring."
                    icon={Server}
                />

            )}

       </div>

      </section>

     </>
 );
}


function Empty({ text, icon: Icon }) {

 return (
     <div className="empty">

      <Icon size={28} />

      <p>
       {text}
      </p>

     </div>
 );
}