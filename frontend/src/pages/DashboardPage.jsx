import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import ExpenseChart from "../components/ExpenseChart";
import { toast } from "react-toastify";

function DashboardPage() {
    const [expenses, setExpenses] = useState([]);
    const [editId, setEditId] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [userName, setUserName] = useState("");

    const [summary, setSummary] = useState({
        totalExpense: 0,
        totalTransactions: 0
    });

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "FOOD",
        expenseDate: "",
        description: ""
    });

    useEffect(() => {
        fetchExpenses(0);
        fetchSummary();
        fetchCategorySummary();
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axiosClient.get("/api/users/profile");
            setUserName(response.data.name);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchExpenses = async (currentPage = 0) => {
        try {
            const response = await axiosClient.get(
                `/api/expenses?page=${currentPage}&size=5`
            );

            setExpenses(response.data.content);
            setPage(response.data.number);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await axiosClient.get("/api/dashboard/summary");
            setSummary(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCategorySummary = async () => {
        try {
            const response = await axiosClient.get(
                "/api/expenses/summary/category"
            );

            setChartData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.amount || !formData.expenseDate) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            if (editId) {
                await axiosClient.put(`/api/expenses/${editId}`, {
                    ...formData,
                    amount: Number(formData.amount)
                });
            } else {
                await axiosClient.post("/api/expenses", {
                    ...formData,
                    amount: Number(formData.amount)
                });
            }

            toast.success(
                editId
                    ? "Expense updated successfully"
                    : "Expense added successfully"
            );

            fetchExpenses(page);
            fetchSummary();
            fetchCategorySummary();

            setFormData({
                title: "",
                amount: "",
                category: "FOOD",
                expenseDate: "",
                description: ""
            });

            setEditId(null);
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axiosClient.delete(`/api/expenses/${id}`);

            toast.success("Expense deleted successfully");

            fetchExpenses(page);
            fetchSummary();
            fetchCategorySummary();
        } catch (error) {
            toast.error("Failed to delete expense");
            console.log(error);
        }
    };

    const editExpense = (expense) => {
        setEditId(expense.id);

        setFormData({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            expenseDate: expense.expenseDate,
            description: expense.description
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const filterByCategory = async () => {
        try {
            const response = await axiosClient.get(
                `/api/expenses/category/${selectedCategory}`
            );

            setExpenses(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const filterByDateRange = async () => {
        try {
            const response = await axiosClient.get(
                `/api/expenses/date-range?startDate=${startDate}&endDate=${endDate}`
            );

            setExpenses(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const filterByAmountRange = async () => {
        try {
            const response = await axiosClient.get(
                `/api/expenses/amount-range?minAmount=${minAmount}&maxAmount=${maxAmount}`
            );

            setExpenses(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const searchExpenses = async () => {
        try {
            const response = await axiosClient.get(
                `/api/expenses/search?keyword=${searchKeyword}`
            );

            setExpenses(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const resetFilters = () => {
        setSelectedCategory("");
        setStartDate("");
        setEndDate("");
        setMinAmount("");
        setMaxAmount("");
        setSearchKeyword("");

        fetchExpenses(0);
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <div>
                    <h1 style={{ margin: 0, color: "#f8fafc" }}>
                        ExpenseFlow Dashboard
                    </h1>

                    <p style={{ marginTop: "6px", color: "#94a3b8" }}>
                        Manage, track and analyze your expenses
                    </p>
                </div>

                <div style={headerRightStyle}>
                    <div style={userInfoStyle}>
                        <div style={avatarStyle}>👤</div>
                        <span>Welcome, {userName || "User"}</span>
                    </div>

                    <button onClick={logout} style={logoutButton}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={summaryGrid}>
                <div style={cardStyle}>
                    <p style={mutedText}>Total Expense</p>
                    <h1 style={{ color: "#38bdf8" }}>
                        ₹{summary.totalExpense}
                    </h1>
                </div>

                <div style={cardStyle}>
                    <p style={mutedText}>Total Transactions</p>
                    <h1 style={{ color: "#22c55e" }}>
                        {summary.totalTransactions}
                    </h1>
                </div>
            </div>

            <div style={mainGrid}>
                <div style={leftColumn}>
                    <div style={cardStyle}>
                        <h2>{editId ? "Edit Expense" : "Add Expense"}</h2>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Expense Title"
                                value={formData.title}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={formData.amount}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="FOOD">FOOD</option>
                                <option value="TRAVEL">TRAVEL</option>
                                <option value="SHOPPING">SHOPPING</option>
                                <option value="HEALTH">HEALTH</option>
                                <option value="BILLS">BILLS</option>
                                <option value="ENTERTAINMENT">ENTERTAINMENT</option>
                                <option value="EDUCATION">EDUCATION</option>
                                <option value="OTHER">OTHER</option>
                            </select>

                            <input
                                type="date"
                                name="expenseDate"
                                value={formData.expenseDate}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                style={{
                                    ...inputStyle,
                                    height: "90px",
                                    resize: "none"
                                }}
                            />

                            <button type="submit" style={primaryButton}>
                                {editId ? "Update Expense" : "Add Expense"}
                            </button>
                        </form>
                    </div>

                    <div style={cardStyle}>
                        <h2 style={{ marginBottom: "22px" }}>Filters</h2>

                        <div style={filterGrid}>
                            <div style={filterGroup}>
                                <label style={filterLabel}>Category</label>

                                <div style={filterLine}>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) =>
                                            setSelectedCategory(e.target.value)
                                        }
                                        style={filterInput}
                                    >
                                        <option value="">Select category</option>
                                        <option value="FOOD">FOOD</option>
                                        <option value="TRAVEL">TRAVEL</option>
                                        <option value="SHOPPING">SHOPPING</option>
                                        <option value="HEALTH">HEALTH</option>
                                        <option value="BILLS">BILLS</option>
                                        <option value="ENTERTAINMENT">
                                            ENTERTAINMENT
                                        </option>
                                        <option value="EDUCATION">EDUCATION</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>

                                    <button
                                        onClick={filterByCategory}
                                        style={filterButton}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div style={filterGroup}>
                                <label style={filterLabel}>Date Range</label>

                                <div style={filterLine}>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        style={dateInput}
                                    />

                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        style={dateInput}
                                    />

                                    <button
                                        onClick={filterByDateRange}
                                        style={filterButton}
                                    >
                                        Filter
                                    </button>
                                </div>
                            </div>

                            <div style={filterGroup}>
                                <label style={filterLabel}>Amount Range</label>

                                <div style={filterLine}>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minAmount}
                                        onChange={(e) =>
                                            setMinAmount(e.target.value)
                                        }
                                        style={amountInput}
                                    />

                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxAmount}
                                        onChange={(e) =>
                                            setMaxAmount(e.target.value)
                                        }
                                        style={amountInput}
                                    />

                                    <button
                                        onClick={filterByAmountRange}
                                        style={filterButton}
                                    >
                                        Filter
                                    </button>
                                </div>
                            </div>

                            <div style={filterGroup}>
                                <label style={filterLabel}>Search</label>

                                <div style={filterLine}>
                                    <input
                                        type="text"
                                        placeholder="Search expense"
                                        value={searchKeyword}
                                        onChange={(e) =>
                                            setSearchKeyword(e.target.value)
                                        }
                                        style={filterInput}
                                    />

                                    <button
                                        onClick={searchExpenses}
                                        style={filterButton}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button onClick={resetFilters} style={resetButton}>
                            Reset All Filters
                        </button>
                    </div>
                </div>

                <div style={rightColumn}>
                    <div style={cardStyle}>
                        <h2>Expense Analytics</h2>
                        <ExpenseChart data={chartData} />
                    </div>

                    <div style={cardStyle}>
                        <h2>Your Expenses</h2>

                        <table style={tableStyle}>
                            <thead>
                            <tr style={{ backgroundColor: "#1e293b" }}>
                                <th style={tableHeader}>Title</th>
                                <th style={tableHeader}>Amount</th>
                                <th style={tableHeader}>Category</th>
                                <th style={tableHeader}>Date</th>
                                <th style={tableHeader}>Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td style={tableCell}>{expense.title}</td>

                                    <td style={tableCell}>
                                        ₹{expense.amount}
                                    </td>

                                    <td style={tableCell}>
                                        {expense.category}
                                    </td>

                                    <td style={tableCell}>
                                        {expense.expenseDate}
                                    </td>

                                    <td style={tableCell}>
                                        <div style={actionWrapper}>
                                            <button
                                                onClick={() =>
                                                    editExpense(expense)
                                                }
                                                style={editButton}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteExpense(expense.id)
                                                }
                                                style={deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div style={paginationStyle}>
                            <button
                                disabled={page === 0}
                                onClick={() => fetchExpenses(page - 1)}
                                style={smallButton}
                            >
                                Previous
                            </button>

                            <span>Page {page + 1} of {totalPages}</span>

                            <button
                                disabled={page + 1 === totalPages}
                                onClick={() => fetchExpenses(page + 1)}
                                style={smallButton}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    padding: "30px",
    fontFamily: "Arial",
    color: "#e5e7eb"
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px"
};

const headerRightStyle = {
    display: "flex",
    alignItems: "center",
    gap: "18px"
};

const userInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#e5e7eb",
    fontWeight: "bold",
    backgroundColor: "#111827",
    border: "1px solid #1f2937",
    padding: "8px 14px",
    borderRadius: "12px"
};

const avatarStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const summaryGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "25px"
};

const mainGrid = {
    display: "grid",
    gridTemplateColumns: "560px 1fr",
    gap: "32px",
    alignItems: "start"
};

const leftColumn = {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
};

const rightColumn = {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
};

const cardStyle = {
    backgroundColor: "#111827",
    border: "1px solid #1f2937",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
};

const mutedText = {
    color: "#94a3b8",
    marginBottom: "8px"
};

const inputStyle = {
    width: "100%",
    padding: "13px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #334155",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "14px"
};

const filterGrid = {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
};

const filterGroup = {
    width: "100%"
};

const filterLabel = {
    display: "block",
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "8px",
    fontWeight: "bold"
};

const filterLine = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    flexWrap: "nowrap"
};

const filterInput = {
    flex: 1,
    minWidth: 0,
    height: "44px",
    padding: "0 12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    outline: "none",
    fontSize: "14px"
};

const dateInput = {
    width: "155px",
    height: "44px",
    padding: "0 10px",
    borderRadius: "10px",
    border: "1px solid #334155",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box"
};

const amountInput = {
    width: "135px",
    height: "44px",
    padding: "0 12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box"
};

const primaryButton = {
    width: "100%",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer"
};

const smallButton = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap"
};

const filterButton = {
    width: "95px",
    height: "44px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    flexShrink: 0
};

const resetButton = {
    width: "100%",
    marginTop: "22px",
    backgroundColor: "#475569",
    color: "white",
    border: "none",
    padding: "13px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
};

const logoutButton = {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed"
};

const tableHeader = {
    padding: "13px",
    color: "#cbd5e1",
    textAlign: "center"
};

const tableCell = {
    padding: "13px",
    borderBottom: "1px solid #1f2937",
    textAlign: "center",
    color: "#e5e7eb",
    wordBreak: "normal"
};

const actionWrapper = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    flexWrap: "nowrap"
};

const editButton = {
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    padding: "7px 13px",
    borderRadius: "8px",
    cursor: "pointer",
    minWidth: "58px"
};

const deleteButton = {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "7px 13px",
    borderRadius: "8px",
    cursor: "pointer",
    minWidth: "68px"
};

const paginationStyle = {
    marginTop: "22px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    color: "#cbd5e1"
};

export default DashboardPage;