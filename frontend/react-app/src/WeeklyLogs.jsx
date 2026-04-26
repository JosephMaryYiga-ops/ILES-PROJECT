function WeeklyLogs() {
  const logs = [
    { id: 1, week: 1, content: "Learned React basics", status: "Approved" },
    { id: 2, week: 2, content: "Worked on backend", status: "Pending" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Weekly Logs</h2>

      {logs.map((log) => (
        <div key={log.id} style={{ marginBottom: "10px" }}>
          <h4>Week {log.week}</h4>
          <p>{log.content}</p>
          <strong>Status: {log.status}</strong>
        </div>
      ))}
    </div>
  );
}

export default WeeklyLogs;