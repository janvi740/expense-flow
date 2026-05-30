import {
    PieChart,
    Pie,
    Tooltip,
    Cell,
    Legend
} from "recharts";

function ExpenseChart({ data }) {

    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#AA336A",
        "#663399"
    ];

    return (

        <PieChart width={400} height={400}>

            <Pie
                data={data}
                dataKey="total"
                nameKey="category"
                outerRadius={120}
                label
            >

                {
                    data.map((entry, index) => (

                        <Cell
                            key={index}
                            fill={
                                COLORS[
                                index % COLORS.length
                                    ]
                            }
                        />
                    ))
                }

            </Pie>

            <Tooltip />

            <Legend />

        </PieChart>
    );
}

export default ExpenseChart;