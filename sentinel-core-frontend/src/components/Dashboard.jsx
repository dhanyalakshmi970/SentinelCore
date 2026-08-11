
import { useEffect, useState } from 'react';
import { getDashboardSummary, getAllAssets } from '../api/assetApi';

import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Chip,
    LinearProgress,
    Divider
} from '@mui/material';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    CartesianGrid
} from 'recharts';


function Dashboard() {

    const [summary, setSummary] = useState(null);
    const [assets, setAssets] = useState([]);


    // ================= LOAD DATA =================

    useEffect(() => {

        getDashboardSummary()
            .then(res => setSummary(res.data))
            .catch(error =>
                console.error("Summary API Error:", error)
            );

        getAllAssets()
            .then(res => setAssets(res.data))
            .catch(error =>
                console.error("Assets API Error:", error)
            );

    }, []);


    // ================= LOADING =================

    if (!summary) {

        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#0b1120',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h5">
                    Loading SentinelCore...
                </Typography>
            </Box>
        );

    }


    // ================= ASSET STATUS DATA =================

    const onlineAssets =
        assets.filter(asset => asset.status === "ONLINE").length;

    const warningAssets =
        assets.filter(asset => asset.status === "WARNING").length;

    const criticalAssets =
        assets.filter(asset => asset.status === "CRITICAL").length;


    const statusData = [
        {
            name: "Online",
            value: onlineAssets
        },
        {
            name: "Warning",
            value: warningAssets
        },
        {
            name: "Critical",
            value: criticalAssets
        }
    ];


    // ================= RESOURCE DATA =================

    const resourceData = assets.map(asset => ({
        name: asset.assetName,
        CPU: asset.cpuUsage || 0,
        Memory: asset.memoryUsage || 0,
        Disk: asset.disk || 0
    }));


    return (

        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#0b1120',
                color: 'white',
                padding: '30px'
            }}
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            color: '#38bdf8'
                        }}
                    >
                        🛡 SentinelCore
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: '#94a3b8',
                            marginTop: '5px'
                        }}
                    >
                        Enterprise Security Operations Dashboard
                    </Typography>

                </Box>


                <Chip
                    label="SYSTEM ONLINE"
                    sx={{
                        backgroundColor: '#064e3b',
                        color: '#4ade80',
                        fontWeight: 'bold',
                        border: '1px solid #22c55e'
                    }}
                />

            </Box>


            {/* ================================================= */}
            {/* SECTION 1 — KEY METRICS */}
            {/* ================================================= */}

            <Typography
                variant="h6"
                sx={{
                    color: '#94a3b8',
                    marginBottom: '15px'
                }}
            >
                System Overview
            </Typography>


            <Grid container spacing={3}>

                {/* TOTAL ASSETS */}

                <Grid item xs={12} sm={6} md={3}>

                    <Card
                        sx={{
                            backgroundColor: '#111827',
                            color: 'white',
                            border: '1px solid #1e3a5f',
                            borderRadius: '15px'
                        }}
                    >

                        <CardContent>

                            <Typography sx={{ color: '#94a3b8' }}>
                                TOTAL ASSETS
                            </Typography>

                            <Typography
                                variant="h3"
                                sx={{
                                    color: '#38bdf8',
                                    fontWeight: 'bold'
                                }}
                            >
                                {summary.totalAssets}
                            </Typography>

                            <Typography sx={{ color: '#64748b' }}>
                                Monitored infrastructure
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>


                {/* UPTIME */}

                <Grid item xs={12} sm={6} md={3}>

                    <Card
                        sx={{
                            backgroundColor: '#111827',
                            color: 'white',
                            border: '1px solid #14532d',
                            borderRadius: '15px'
                        }}
                    >

                        <CardContent>

                            <Typography sx={{ color: '#94a3b8' }}>
                                SYSTEM UPTIME
                            </Typography>

                            <Typography
                                variant="h3"
                                sx={{
                                    color: '#4ade80',
                                    fontWeight: 'bold'
                                }}
                            >
                                {summary.uptimePercentage.toFixed(2)}%
                            </Typography>

                            <Typography sx={{ color: '#64748b' }}>
                                Infrastructure health
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>


                {/* CPU */}

                <Grid item xs={12} sm={6} md={3}>

                    <Card
                        sx={{
                            backgroundColor: '#111827',
                            color: 'white',
                            border: '1px solid #713f12',
                            borderRadius: '15px'
                        }}
                    >

                        <CardContent>

                            <Typography sx={{ color: '#94a3b8' }}>
                                AVG CPU USAGE
                            </Typography>

                            <Typography
                                variant="h3"
                                sx={{
                                    color: '#facc15',
                                    fontWeight: 'bold'
                                }}
                            >
                                {summary.avgCpuUsage.toFixed(1)}%
                            </Typography>

                            <LinearProgress
                                variant="determinate"
                                value={summary.avgCpuUsage}
                                sx={{ marginTop: 2 }}
                            />

                        </CardContent>

                    </Card>

                </Grid>


                {/* ALERTS */}

                <Grid item xs={12} sm={6} md={3}>

                    <Card
                        sx={{
                            backgroundColor: '#111827',
                            color: 'white',
                            border: '1px solid #7f1d1d',
                            borderRadius: '15px'
                        }}
                    >

                        <CardContent>

                            <Typography sx={{ color: '#94a3b8' }}>
                                CRITICAL ALERTS
                            </Typography>

                            <Typography
                                variant="h3"
                                sx={{
                                    color: '#f87171',
                                    fontWeight: 'bold'
                                }}
                            >
                                {summary.criticalAlerts}
                            </Typography>

                            <Typography sx={{ color: '#64748b' }}>
                                Requires attention
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>


            {/* ================================================= */}
            {/* SECTION 2 — ASSET STATUS */}
            {/* ================================================= */}

            <Typography
                variant="h6"
                sx={{
                    color: '#94a3b8',
                    marginTop: '40px',
                    marginBottom: '15px'
                }}
            >
                Asset Health
            </Typography>


            <Grid container spacing={3}>

                {/* STATUS CHART */}

                <Grid item xs={12} md={5}>

                    <Card
                        sx={{
                            backgroundColor: '#111827',
                            color: 'white',
                            borderRadius: '15px',
                            border: '1px solid #1e3a5f'
                        }}
                    >

                        <CardContent>

                            <Typography
                                variant="h6"
                                sx={{ color: '#38bdf8' }}
                            >
                                Asset Status
                            </Typography>

                            <ResponsiveContainer
                                width="100%"
                                height={280}
                            >

                                <PieChart>

                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        label
                                    >

                                        <Cell fill="#22c55e" />
                                        <Cell fill="#facc15" />
                                        <Cell fill="#ef4444" />

                                    </Pie>

                                    <Tooltip />

                                </PieChart>

                            </ResponsiveContainer>

                        </CardContent>

                    </Card>

                </Grid>


                {/* STATUS SUMMARY */}

                <Grid item xs={12} md={7}>

                    <Card
                        sx={{
                            backgroundColor: '#111827',
                            color: 'white',
                            borderRadius: '15px',
                            border: '1px solid #1e3a5f'
                        }}
                    >

                        <CardContent>

                            <Typography
                                variant="h6"
                                sx={{ color: '#38bdf8' }}
                            >
                                Current Asset Health
                            </Typography>


                            <Box sx={{ marginTop: 3 }}>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 1
                                    }}
                                >
                                    <Typography>
                                        Online
                                    </Typography>

                                    <Typography sx={{ color: '#4ade80' }}>
                                        {onlineAssets}
                                    </Typography>
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={
                                        summary.totalAssets
                                            ? (onlineAssets /
                                                summary.totalAssets) * 100
                                            : 0
                                    }
                                    sx={{ marginBottom: 3 }}
                                />


                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 1
                                    }}
                                >
                                    <Typography>
                                        Warning
                                    </Typography>

                                    <Typography sx={{ color: '#facc15' }}>
                                        {warningAssets}
                                    </Typography>
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={
                                        summary.totalAssets
                                            ? (warningAssets /
                                                summary.totalAssets) * 100
                                            : 0
                                    }
                                    sx={{ marginBottom: 3 }}
                                />


                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 1
                                    }}
                                >
                                    <Typography>
                                        Critical
                                    </Typography>

                                    <Typography sx={{ color: '#f87171' }}>
                                        {criticalAssets}
                                    </Typography>
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={
                                        summary.totalAssets
                                            ? (criticalAssets /
                                                summary.totalAssets) * 100
                                            : 0
                                    }
                                />

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>


            {/* ================================================= */}
            {/* SECTION 3 — RESOURCE MONITORING */}
            {/* ================================================= */}

            <Typography
                variant="h6"
                sx={{
                    color: '#94a3b8',
                    marginTop: '40px',
                    marginBottom: '15px'
                }}
            >
                Infrastructure Resource Monitoring
            </Typography>


            <Card
                sx={{
                    backgroundColor: '#111827',
                    color: 'white',
                    border: '1px solid #1e3a5f',
                    borderRadius: '15px'
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        sx={{
                            color: '#38bdf8',
                            marginBottom: 2
                        }}
                    >
                        CPU / Memory / Disk Usage
                    </Typography>


                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >

                        <BarChart data={resourceData}>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#1e293b"
                            />

                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                            />

                            <YAxis
                                stroke="#64748b"
                            />

                            <Tooltip />

                            <Bar
                                dataKey="CPU"
                                fill="#38bdf8"
                            />

                            <Bar
                                dataKey="Memory"
                                fill="#a78bfa"
                            />

                            <Bar
                                dataKey="Disk"
                                fill="#facc15"
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </CardContent>

            </Card>


            {/* ================================================= */}
            {/* SECTION 4 — CPU MONITORING */}
            {/* ================================================= */}

            <Typography
                variant="h6"
                sx={{
                    color: '#94a3b8',
                    marginTop: '40px',
                    marginBottom: '15px'
                }}
            >
                Performance Monitoring
            </Typography>


            <Card
                sx={{
                    backgroundColor: '#111827',
                    color: 'white',
                    border: '1px solid #1e3a5f',
                    borderRadius: '15px'
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        sx={{
                            color: '#38bdf8',
                            fontWeight: 'bold'
                        }}
                    >
                        CPU Usage Monitoring
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: '#64748b',
                            marginBottom: 3
                        }}
                    >
                        CPU utilization across monitored assets
                    </Typography>


                    <Box
                        sx={{
                            width: '100%',
                            height: '350px'
                        }}
                    >

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <LineChart data={assets}>

                                <XAxis
                                    dataKey="assetName"
                                    stroke="#64748b"
                                />

                                <YAxis
                                    stroke="#64748b"
                                />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#020617',
                                        border: '1px solid #38bdf8',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="cpuUsage"
                                    stroke="#38bdf8"
                                    strokeWidth={3}
                                    dot={{ r: 5 }}
                                    activeDot={{ r: 8 }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </Box>

                </CardContent>

            </Card>


            {/* ================================================= */}
            {/* SECTION 5 — RECENT ASSETS */}
            {/* ================================================= */}

            <Typography
                variant="h6"
                sx={{
                    color: '#94a3b8',
                    marginTop: '40px',
                    marginBottom: '15px'
                }}
            >
                Monitored Assets
            </Typography>


            <Card
                sx={{
                    backgroundColor: '#111827',
                    color: 'white',
                    border: '1px solid #1e3a5f',
                    borderRadius: '15px'
                }}
            >

                <CardContent>

                    {assets.map((asset) => (

                        <Box key={asset.id}>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        '2fr 1fr 1fr 1fr',
                                    gap: 2,
                                    padding: 2,
                                    alignItems: 'center'
                                }}
                            >

                                <Box>

                                    <Typography
                                        sx={{
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {asset.assetName}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        sx={{ color: '#64748b' }}
                                    >
                                        {asset.assetType}
                                    </Typography>

                                </Box>


                                <Typography
                                    sx={{ color: '#94a3b8' }}
                                >
                                    CPU: {asset.cpuUsage}%
                                </Typography>


                                <Typography
                                    sx={{ color: '#94a3b8' }}
                                >
                                    Memory: {asset.memoryUsage}%
                                </Typography>


                                <Chip
                                    label={asset.status}
                                    size="small"
                                    sx={{
                                        backgroundColor:
                                            asset.status === "ONLINE"
                                                ? '#064e3b'
                                                : asset.status === "WARNING"
                                                    ? '#713f12'
                                                    : '#7f1d1d',

                                        color:
                                            asset.status === "ONLINE"
                                                ? '#4ade80'
                                                : asset.status === "WARNING"
                                                    ? '#facc15'
                                                    : '#f87171'
                                    }}
                                />

                            </Box>

                            <Divider
                                sx={{
                                    borderColor: '#1e293b'
                                }}
                            />

                        </Box>

                    ))}

                </CardContent>

            </Card>


            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <Box
                sx={{
                    marginTop: '40px',
                    textAlign: 'center',
                    color: '#475569'
                }}
            >

                <Typography variant="body2">
                    SentinelCore Enterprise Security Operations Platform
                </Typography>

                <Typography variant="caption">
                    Monitoring infrastructure • Security • Alerts
                </Typography>

            </Box>

        </Box>
    );
}


export default Dashboard;
