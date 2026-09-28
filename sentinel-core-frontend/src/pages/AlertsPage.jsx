import { useEffect, useState } from "react";

import {
    Check,
    RefreshCw,
    Search,
    ShieldAlert
} from "../components/Icons";

import {
    getAllAlerts,
    resolveAlert
} from "../api/securityApi";

import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";


export default function AlertsPage() {

    // ============================================================
    // STATE
    // ============================================================

    const [data, setData] = useState([]);

    const [q, setQ] = useState("");

    const [loading, setLoading] = useState(false);

    const [resolvingId, setResolvingId] =
        useState(null);


    // ============================================================
    // LOAD ALL ALERTS
    // ============================================================

    const load = async () => {

        setLoading(true);

        try {

            const response =
                await getAllAlerts();

            console.log(
                "All alerts:",
                response.data
            );

            setData(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load alerts:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        load();

    }, []);


    // ============================================================
    // SEARCH
    // ============================================================

    const rows = data.filter((a) => {

        const searchText = `
            ${a.assetName || ""}
            ${a.message || ""}
            ${a.severity || ""}
            ${a.status || ""}
        `.toLowerCase();

        return searchText.includes(
            q.toLowerCase()
        );
    });


    // ============================================================
    // OPEN ALERT COUNT
    // ============================================================

    const openAlerts = data.filter(
        (a) =>
            String(a.status || "")
                .toUpperCase() === "OPEN"
    );


    // ============================================================
    // CRITICAL OPEN ALERTS
    // ============================================================

    const criticalAlerts =
        openAlerts.filter(
            (a) =>
                String(a.severity || "")
                    .toUpperCase() === "CRITICAL"
        );


    // ============================================================
    // HIGH OPEN ALERTS
    // ============================================================

    const highAlerts =
        openAlerts.filter(
            (a) =>
                String(a.severity || "")
                    .toUpperCase() === "HIGH"
        );


    // ============================================================
    // RESOLVE ALERT
    // ============================================================

    const resolve = async (id) => {

        // Prevent duplicate clicks

        if (resolvingId !== null) {

            return;
        }


        console.log(
            "================================="
        );

        console.log(
            "RESOLVE BUTTON CLICKED"
        );

        console.log(
            "Alert ID:",
            id
        );


        try {

            setResolvingId(id);


            // ----------------------------------------------------
            // PUT /api/alerts/{id}/resolve
            // ----------------------------------------------------

            const response =
                await resolveAlert(id);


            console.log(
                "RESOLVE SUCCESS"
            );

            console.log(
                "Backend response:",
                response.data
            );


            // ----------------------------------------------------
            // Reload ALL alerts
            // ----------------------------------------------------

            await load();


            console.log(
                "ALERT LIST REFRESHED"
            );

            console.log(
                "================================="
            );

        } catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "RESOLVE FAILED"
            );

            console.error(
                "Error:",
                error
            );

            console.error(
                "HTTP Status:",
                error.response?.status
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            console.error(
                "================================="
            );

        } finally {

            setResolvingId(null);
        }
    };


    // ============================================================
    // UI
    // ============================================================

    return (
        <>

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <PageHeader
                title="Alert center"
                description="Investigate active infrastructure and security signals before they become incidents."
                actions={

                    <button
                        type="button"
                        className="btn secondary"
                        onClick={load}
                        disabled={loading}
                    >

                        <RefreshCw size={16} />

                        {loading
                            ? "Refreshing..."
                            : "Refresh"}

                    </button>
                }
            />


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="mini-stats">


                {/* OPEN */}

                <div className="mini-stat">

                    <div>

                        <b>
                            {openAlerts.length}
                        </b>

                        <span>
                            Open alerts
                        </span>

                    </div>

                </div>


                {/* CRITICAL */}

                <div className="mini-stat">

                    <div>

                        <b>
                            {criticalAlerts.length}
                        </b>

                        <span>
                            Critical
                        </span>

                    </div>

                </div>


                {/* HIGH */}

                <div className="mini-stat">

                    <div>

                        <b>
                            {highAlerts.length}
                        </b>

                        <span>
                            High
                        </span>

                    </div>

                </div>

            </div>


            {/* ==================================================
                ALERT PANEL
            ================================================== */}

            <section className="panel">


                {/* SEARCH */}

                <div className="filterbar">

                    <div className="search-box">

                        <Search size={17} />

                        <input
                            type="text"
                            value={q}
                            onChange={(e) =>
                                setQ(
                                    e.target.value
                                )
                            }
                            placeholder="Search alerts..."
                        />

                    </div>

                </div>


                {/* ==================================================
                    TABLE
                ================================================== */}

                <div className="table-wrap">

                    <table>

                        <thead>

                        <tr>

                            <th>
                                Severity
                            </th>

                            <th>
                                Asset
                            </th>

                            <th>
                                Signal
                            </th>

                            <th>
                                Created
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {rows.map((a) => {

                            const status =
                                String(
                                    a.status || ""
                                ).toUpperCase();


                            return (

                                <tr
                                    key={a.id}
                                >


                                    {/* SEVERITY */}

                                    <td>

                                        <StatusBadge
                                            value={
                                                a.severity
                                            }
                                        />

                                    </td>


                                    {/* ASSET */}

                                    <td>

                                        <b>

                                            {
                                                a.assetName ||
                                                `Asset #${a.assetId}`
                                            }

                                        </b>

                                    </td>


                                    {/* SIGNAL */}

                                    <td>

                                        {
                                            a.message ||
                                            "No message"
                                        }

                                    </td>


                                    {/* CREATED */}

                                    <td>

                                        {
                                            format(
                                                a.createdAt
                                            )
                                        }

                                    </td>


                                    {/* STATUS */}

                                    <td>

                                        <StatusBadge
                                            value={
                                                status
                                            }
                                        />

                                    </td>


                                    {/* ACTION */}

                                    <td>

                                        {status ===
                                        "OPEN" ? (

                                            <button
                                                type="button"
                                                className="icon-action"
                                                title={
                                                    resolvingId ===
                                                    a.id
                                                        ? "Resolving..."
                                                        : "Resolve"
                                                }
                                                disabled={
                                                    resolvingId !==
                                                    null
                                                }
                                                onClick={() =>
                                                    resolve(
                                                        a.id
                                                    )
                                                }
                                                style={{
                                                    opacity:
                                                        resolvingId !==
                                                        null
                                                            ? 0.5
                                                            : 1,

                                                    cursor:
                                                        resolvingId !==
                                                        null
                                                            ? "not-allowed"
                                                            : "pointer"
                                                }}
                                            >

                                                <Check
                                                    size={16}
                                                />

                                            </button>

                                        ) : (

                                            <span className="muted">
                                                    Resolved
                                                </span>

                                        )}

                                    </td>

                                </tr>

                            );

                        })}

                        </tbody>

                    </table>


                    {/* ==================================================
                        EMPTY STATE
                    ================================================== */}

                    {!rows.length &&
                        !loading && (

                            <div className="empty">

                                <ShieldAlert
                                    size={28}
                                />

                                <p>
                                    No alerts found.
                                </p>

                            </div>
                        )}


                    {/* ==================================================
                        LOADING
                    ================================================== */}

                    {loading && (

                        <div className="empty">

                            <p>
                                Loading alerts...
                            </p>

                        </div>
                    )}

                </div>

            </section>

        </>
    );
}


// ============================================================
// DATE FORMATTER
// ============================================================

const format = (value) => {

    if (!value) {

        return "—";
    }

    return new Date(value)
        .toLocaleString(
            [],
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
};