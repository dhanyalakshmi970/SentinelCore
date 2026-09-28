import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from "recharts";

const COLORS = {
    ONLINE: "#22c55e",
    WARNING: "#f59e0b",
    CRITICAL: "#ef4444",
    OFFLINE: "#94a3b8"
};

export default function AssetHealth({ assets = [] }) {

    const statusData = [
        {
            name: "ONLINE",
            value: assets.filter(
                a => a.status === "ONLINE"
            ).length
        },
        {
            name: "WARNING",
            value: assets.filter(
                a => a.status === "WARNING"
            ).length
        },
        {
            name: "CRITICAL",
            value: assets.filter(
                a => a.status === "CRITICAL"
            ).length
        },
        {
            name: "OFFLINE",
            value: assets.filter(
                a => a.status === "OFFLINE"
            ).length
        }
    ];

    const chartData =
        statusData.filter(
            item => item.value > 0
        );

    const total = assets.length;


    return (
        <section className="panel asset-health-panel">

            <div className="panel-head">

                <div>

                    <h2>
                        Asset health
                    </h2>

                    <p>
                        Current fleet distribution
                    </p>

                </div>

            </div>


            <div className="asset-health-chart">

                <ResponsiveContainer
                    width="100%"
                    height={220}
                >

                    <PieChart>

                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={92}
                            paddingAngle={4}
                            cornerRadius={6}
                            stroke="none"
                        >

                            {chartData.map(item => (

                                <Cell
                                    key={item.name}
                                    fill={COLORS[item.name]}
                                />

                            ))}

                        </Pie>

                        <Tooltip
                            formatter={(value, name) => [
                                `${value} assets`,
                                name
                            ]}
                        />

                    </PieChart>

                </ResponsiveContainer>


                <div className="asset-health-center">

                    <strong>
                        {total}
                    </strong>

                    <span>
            assets
          </span>

                </div>

            </div>


            <div className="asset-health-legend">

                {statusData.map(item => (

                    <div
                        className="asset-health-item"
                        key={item.name}
                    >

                        <div className="asset-health-label">

              <span
                  className="asset-health-dot"
                  style={{
                      backgroundColor:
                          COLORS[item.name],
                      boxShadow:
                          `0 0 7px ${COLORS[item.name]}`
                  }}
              />

                            <span>
                {item.name}
              </span>

                        </div>

                        <strong>
                            {item.value}
                        </strong>

                    </div>

                ))}

            </div>

        </section>
    );
}