import { useState } from "react";

function SubmitLog() {
  const [week, setWeek] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const logData = {
      week,
      content,
    };

    console.log("Submitted Log:", logData);

    alert("Log submitted (fake)");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Submit Weekly Log</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Week Number"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
        />
        <br /><br />

        <textarea
          placeholder="What did you do this week?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SubmitLog;