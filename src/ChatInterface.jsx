import React, { useState, useEffect, useRef } from "react";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [comparePlayers, setComparePlayers] = useState(["", ""]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("summary");
  const chatBoxRef = useRef(null);
  const [teamA, setTeamA] = useState([""]);
  const [teamB, setTeamB] = useState([""]);
  const [tradeContext, setTradeContext] = useState("");


  useEffect(() => {
    if (chatBoxRef.current) {
      console.log("🔍 Before Scroll:");
      console.log("Chat Box Scroll Height:", chatBoxRef.current.scrollHeight);
      console.log("Chat Box Client Height:", chatBoxRef.current.clientHeight);
      console.log("Chat Box Scroll Top Before:", chatBoxRef.current.scrollTop);

      console.log("📝 Rendered Chat Text (From UI):", chatBoxRef.current.innerText); // Debugging chat-box output

      // Attempt to auto-scroll to bottom
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;

      console.log("🔍 After Scroll:");
      console.log("Chat Box Scroll Top After:", chatBoxRef.current.scrollTop);
    }
  }, [messages]);

  const sendMessage = async () => {
    let apiUrl = "";

    // 🧼 Trimmed input list for compare
    const trimmedComparePlayers = comparePlayers.filter((p) => p.trim() !== "");

    // 🛑 Check inputs per mode
    if ((mode === "summary" || mode === "analyze") && !input.trim()) {
      return;
    }
    if (mode === "compare" && trimmedComparePlayers.length < 2) {
      return;
    }
    if (mode === "trade") {
      const trimmedA = teamA.filter((p) => p.trim() !== "");
      const trimmedB = teamB.filter((p) => p.trim() !== "");

      if (trimmedA.length === 0 || trimmedB.length === 0) {
        setMessages((prev) => [
          ...prev,
          { text: "⚠️ You must enter at least one player on each team.", sender: "bot" }
        ]);
        return;
      }

      const userText = `📢 **TRADE Mode**:\nTeam A: ${trimmedA.join(", ")}\nTeam B: ${trimmedB.join(", ")}\nContext: ${tradeContext || "(no extra context)"}`;
      setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
      setTeamA([""]);
      setTeamB([""]);
      setTradeContext("");
      setLoading(true);

      try {
        const response = await fetch("https://fantasai-test-production.up.railway.app/trade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamA: trimmedA,
            teamB: trimmedB,
            context: tradeContext
          })
        });

        const data = await response.json();
        console.log("✅ Trade API Response:", data);

        if (data.error) {
          setMessages((prev) => [...prev, { text: `⚠️ Error: ${data.error}`, sender: "bot" }]);
        } else {
          setMessages((prev) => [...prev, { text: `📈 **Trade Evaluation**\n${data.analysis}`, sender: "bot" }]);
        }
      } catch (error) {
        console.error("❌ Trade API Error:", error);
        setMessages((prev) => [...prev, { text: "⚠️ Error evaluating trade.", sender: "bot" }]);
      } finally {
        setLoading(false);
      }

      return; // ✅ Important: stop here so rest of sendMessage() doesn't run
    }

    // 🎯 Build API URL
    if (mode === "summary") {
      apiUrl = `https://fantasai-test-production.up.railway.app/player/${encodeURIComponent(input)}`;
    } else if (mode === "analyze") {
      apiUrl = `https://fantasai-test-production.up.railway.app/analysis/${encodeURIComponent(input)}`;
    } else if (mode === "compare") {
      const params = new URLSearchParams();
      trimmedComparePlayers.forEach((p) => params.append("players", p));
      apiUrl = `https://fantasai-test-production.up.railway.app/compare-multi?${params.toString()}`;
    }

    // 🧠 Add user message
    const userText =
      mode === "compare"
        ? `📢 **COMPARE Mode**: ${trimmedComparePlayers.join(" vs ")}`
        : `📢 **${mode.toUpperCase()} Mode**: ${input}`;
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);

    // 🧹 Reset inputs
    setInput("");
    setComparePlayers(["", ""]);
    setLoading(true);

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("✅ API Response:", data);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { text: `⚠️ Error: ${data.error}`, sender: "bot" },
        ]);
      } else {
        if (mode === "compare") {
          setMessages((prev) => [
            ...prev,
            { text: `⚖ **Comparison**\n${data.comparison}`, sender: "bot" },
          ]);
        } else if (mode === "analyze") {
          setMessages((prev) => [
            ...prev,
            {
              text: `🔍 **Analysis** for ${data.player_name || input}\n${data.openai_analysis}`,
              sender: "bot",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              text: `📊 **${data.player_name}**\n${data.summary}`,
              sender: "bot",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching:", error);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Error fetching data.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="chat-container">
      <h1 className="hero-text">
        ⚾ Halp-Bot 2000 – Fantasy Baseball Chatbot 🤖
      </h1>

      {/* Chat Box */}
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user" ? "user-message" : "bot-message"
            }
            dangerouslySetInnerHTML={{
              __html: msg.text.replace(/\n/g, "<br/>"),
            }}
          />
        ))}
        {loading && <div className="loading">🤔 Thinking...</div>}
      </div>

      {/* Mode Selector */}
      <div className="mode-selector">
        <button
          onClick={() => setMode("summary")}
          className={mode === "summary" ? "active" : ""}
        >
          Summary
        </button>
        <button
          onClick={() => setMode("analyze")}
          className={mode === "analyze" ? "active" : ""}
        >
          Analyze
        </button>
        <button
          onClick={() => setMode("compare")}
          className={mode === "compare" ? "active" : ""}
        >
          Compare
        </button>
        <button
          onClick={() => setMode("trade")}
          className={mode === "trade" ? "active" : ""}
        >
          Trade
        </button>

      </div>

      {/* Input Box */}
      <div className="input-box">
        {/* For summary & analyze */}
        {(mode === "summary" || mode === "analyze") && (
          <input
            type="text"
            placeholder="Ask about a player..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
        )}

        {/* For compare (already working) */}
        {mode === "compare" && (
          <div className="compare-inputs">
            {comparePlayers.map((player, idx) => (
              <div key={idx} className="compare-input-row">
                <input
                  type="text"
                  placeholder={`Enter player ${idx + 1}`}
                  value={player}
                  onChange={(e) => {
                    const updated = [...comparePlayers];
                    updated[idx] = e.target.value;
                    setComparePlayers(updated);
                  }}
                />
                {idx === comparePlayers.length - 1 && comparePlayers.length < 10 && (
                  <button
                    onClick={() => setComparePlayers([...comparePlayers, ""])}
                    className="add-player-button"
                  >
                    + Add Player
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {mode === "trade" && (
          <div className="trade-inputs">
            <div className="trade-side">
              <h3>Team A</h3>
              {teamA.map((player, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Team A Player ${idx + 1}`}
                  value={player}
                  onChange={(e) => {
                    const updated = [...teamA];
                    updated[idx] = e.target.value;
                    setTeamA(updated);
                  }}
                />
              ))}
              {teamA.length < 10 && (
                <button onClick={() => setTeamA([...teamA, ""])}>+ Add Player</button>
              )}
            </div>

            <div className="trade-side">
              <h3>Team B</h3>
              {teamB.map((player, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Team B Player ${idx + 1}`}
                  value={player}
                  onChange={(e) => {
                    const updated = [...teamB];
                    updated[idx] = e.target.value;
                    setTeamB(updated);
                  }}
                />
              ))}
              {teamB.length < 10 && (
                <button onClick={() => setTeamB([...teamB, ""])}>+ Add Player</button>
              )}
            </div>

            <textarea
              className="trade-context"
              placeholder="Add trade context (e.g. win-now, rebuilding, positional needs)..."
              value={tradeContext}
              onChange={(e) => setTradeContext(e.target.value)}
            />
          </div>
        )}

        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>

    </div>
  );
};

export default ChatInterface;
