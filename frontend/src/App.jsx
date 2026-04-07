import { useState, useEffect } from "react";

function App() {
  const BASE_URL = "http://127.0.0.1:8001";

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [employees, setEmployees] = useState([]);

  const [leaveName, setLeaveName] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaves, setLeaves] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [analytics, setAnalytics] = useState({});

  // --------------------
  // FETCH DATA
  // --------------------
  const getEmployees = async () => {
    const res = await fetch(`${BASE_URL}/employees`);
    const data = await res.json();
    setEmployees(data);
  };

  const getLeaves = async () => {
    const res = await fetch(`${BASE_URL}/leaves`);
    const data = await res.json();
    setLeaves(data);
  };

  const getAnalytics = async () => {
    const res = await fetch(`${BASE_URL}/analytics`);
    const data = await res.json();
    setAnalytics(data);
  };

  useEffect(() => {
    getEmployees();
    getLeaves();
    getAnalytics();
  }, []);

  // --------------------
  // ACTIONS
  // --------------------
  const addEmployee = async () => {
    await fetch(`${BASE_URL}/add_employee`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, department, designation }),
    });
    setName(""); setDepartment(""); setDesignation("");
    getEmployees(); getAnalytics();
  };

  const applyLeave = async () => {
    await fetch(`${BASE_URL}/apply_leave`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name: leaveName, reason: leaveReason }),
    });
    setLeaveName(""); setLeaveReason("");
    getLeaves();
  };

  const updateLeave = async (id, status) => {
    await fetch(`${BASE_URL}/update_leave`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id, status }),
    });
    getLeaves();
  };

  const askQuestion = async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>HRMS Dashboard</h1>

      <div style={styles.grid}>

        {/* EMPLOYEE CARD */}
        <div style={styles.card}>
          <h2>Add Employee</h2>
          <input style={styles.input} placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input style={styles.input} placeholder="Department" value={department} onChange={e=>setDepartment(e.target.value)} />
          <input style={styles.input} placeholder="Designation" value={designation} onChange={e=>setDesignation(e.target.value)} />
          <button style={styles.button} onClick={addEmployee}>Add</button>
        </div>

        {/* EMPLOYEE LIST */}
        <div style={styles.card}>
          <h2>Employees</h2>
          {employees.map(emp => (
            <div key={emp.id} style={styles.listItem}>
              <strong>{emp.name}</strong>
              <p>{emp.department} | {emp.designation}</p>
              <p style={styles.bio}>{emp.bio}</p>
            </div>
          ))}
        </div>

        {/* LEAVE */}
        <div style={styles.card}>
          <h2>Leave</h2>
          <input style={styles.input} placeholder="Name" value={leaveName} onChange={e=>setLeaveName(e.target.value)} />
          <input style={styles.input} placeholder="Reason" value={leaveReason} onChange={e=>setLeaveReason(e.target.value)} />
          <button style={styles.button} onClick={applyLeave}>Apply</button>

          {leaves.map(l => (
            <div key={l.id} style={styles.listItem}>
              {l.name} - {l.reason}
              <p>Status: <b>{l.status}</b></p>
              <button style={styles.smallBtn} onClick={()=>updateLeave(l.id,"Approved")}>Approve</button>
              <button style={styles.rejectBtn} onClick={()=>updateLeave(l.id,"Rejected")}>Reject</button>
            </div>
          ))}
        </div>

        {/* CHATBOT */}
        <div style={styles.card}>
          <h2>Chatbot</h2>
          <input style={styles.input} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask HR..." />
          <button style={styles.button} onClick={askQuestion}>Ask</button>
          <p style={styles.answer}>{answer}</p>
        </div>

        {/* ANALYTICS */}
        <div style={styles.card}>
          <h2>Analytics</h2>
          <p>Total Employees: <b>{analytics.total_employees}</b></p>
          {analytics.department_distribution &&
            Object.entries(analytics.department_distribution).map(([d,c]) => (
              <p key={d}>{d}: {c}</p>
            ))
          }
        </div>

      </div>
    </div>
  );
}

// 🎨 PREMIUM STYLES
const styles = {
  container: {
    padding: "30px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "sans-serif"
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.5)"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "none"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  smallBtn: {
    marginRight: "10px",
    padding: "5px 10px",
    background: "green",
    border: "none",
    color: "#fff",
    borderRadius: "5px"
  },
  rejectBtn: {
    padding: "5px 10px",
    background: "red",
    border: "none",
    color: "#fff",
    borderRadius: "5px"
  },
  listItem: {
    borderBottom: "1px solid #334155",
    padding: "10px 0"
  },
  bio: {
    fontSize: "12px",
    color: "#cbd5f5"
  },
  answer: {
    marginTop: "10px",
    color: "#38bdf8"
  }
};

export default App;