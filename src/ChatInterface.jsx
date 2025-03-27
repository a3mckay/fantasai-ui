import React, { useState, useEffect, useRef } from "react";

const ChatInterface = ({ canExport }) => {
  const [input, setInput] = useState("");
  const [comparePlayers, setComparePlayers] = useState(["", ""]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("summary");
  const chatBoxRef = useRef(null);
  const [teamA, setTeamA] = useState([""]);
  const [teamB, setTeamB] = useState([""]);
  const [tradeContext, setTradeContext] = useState("");
  const [playerSuggestions, setPlayerSuggestions] = useState([]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    fetch("https://fantasai-test-production.up.railway.app/players")
      .then((res) => res.json())
      .then((data) => {
        if (data.players) {
          setPlayerSuggestions([...new Set(data.players)]);
        }
      })
      .catch((err) =>
        console.error("❌ Error fetching player suggestions:", err)
      );
  }, []);

  const handleExportDownload = async () => {
    try {
      const response = await fetch("https://fantasai-test-production.up.railway.app/export-queries");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_queries.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("❌ Error downloading export:", error);
      alert("Failed to download query export.");
    }
  };

  const sendMessage = async () => {
    let apiUrl = "";
    const trimmedComparePlayers = comparePlayers.filter((p) => p.trim() !== "");

    if ((mode === "summary") && !input.trim()) return;
    if (mode === "compare" && trimmedComparePlayers.length < 2) return;

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

      const userText = `📢 **TRADE Mode:**\nTeam A: ${trimmedA.join(", ")}\nTeam B: ${trimmedB.join(", ")}\nContext: ${tradeContext || "(no extra context)"}`;
      setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
      setTeamA([""]);
      setTeamB([""]);
      setTradeContext("");
      setLoading(true);

      try {
        const response = await fetch("https://fantasai-test-production.up.railway.app/trade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamA: trimmedA, teamB: trimmedB, context: tradeContext })
        });

        const data = await response.json();
        if (data.error) {
          setMessages((prev) => [...prev, { text: `⚠️ Error: ${data.error}`, sender: "bot" }]);
        } else {
          setMessages((prev) => [...prev, { text: `📈 **Trade Evaluation**\n${data.analysis}`, sender: "bot" }]);
        }
      } catch (error) {
        setMessages((prev) => [...prev, { text: "⚠️ Error evaluating trade.", sender: "bot" }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === "summary") {
      apiUrl = `https://fantasai-test-production.up.railway.app/player/${encodeURIComponent(input)}`;
    } else if (mode === "compare") {
      const params = new URLSearchParams();
      trimmedComparePlayers.forEach((p) => params.append("players", p));
      apiUrl = `https://fantasai-test-production.up.railway.app/compare-multi?${params.toString()}`;
    }

    const userText =
      mode === "compare"
        ? `📢 **COMPARE Mode:** ${trimmedComparePlayers.join(" vs ")}`
        : `📢 **${mode.toUpperCase()} Mode:** ${input}`;
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);

    setInput("");
    setComparePlayers(["", ""]);
    setLoading(true);

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.error) {
        setMessages((prev) => [...prev, { text: `⚠️ Error: ${data.error}`, sender: "bot" }]);
      } else {
        if (mode === "compare") {
          setMessages((prev) => [...prev, { text: `⚖ **Comparison**\n${data.comparison}`, sender: "bot" }]);
        } else {
          setMessages((prev) => [...prev, { text: `📊 **${data.player_name}**\n${data.summary}`, sender: "bot" }]);
        }
      }
    } catch (error) {
      setMessages((prev) => [...prev, { text: "⚠️ Error fetching data.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1 className="hero-text">⚾ Halp-Bot 2000 – Fantasy Baseball Chatbot 🤖</h1>

      {canExport && (
        <div style={{ marginBottom: "10px" }}>
          <button onClick={handleExportDownload}>Export Queries</button>
        </div>
      )}

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => {
          const formattedText = msg.text
            .replace(/\n/g, "<br>")
            .replace(/\*\*(.+?)\*\*/g, '<span class="highlight-box">$1</span>');

          return (
            <div key={idx} className={`message ${msg.sender}`}>
              <div dangerouslySetInnerHTML={{ __html: formattedText }} />
            </div>
          );
        })}
        {loading && <div className="message bot">⏳ Thinking...</div>}
      </div>

      <div className="mode-selector">
        <button onClick={() => setMode("summary")} className={mode === "summary" ? "active" : ""}>Summary</button>
        <button onClick={() => setMode("compare")} className={mode === "compare" ? "active" : ""}>Compare</button>
        <button onClick={() => setMode("trade")} className={mode === "trade" ? "active" : ""}>Trade</button>
      </div>

      <div className="input-box">
        {mode === "summary" && (
          <input
            type="text"
            list="player-options"
            placeholder="Ask about a player..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
        )}

        {mode === "compare" && (
          <div className="compare-inputs">
            {comparePlayers.map((player, idx) => (
              <div key={idx} className="compare-input-row">
                <input
                  type="text"
                  list="player-options"
                  placeholder={`Enter player ${idx + 1}`}
                  value={player}
                  onChange={(e) => {
                    const updated = [...comparePlayers];
                    updated[idx] = e.target.value;
                    setComparePlayers(updated);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && idx === comparePlayers.length - 1) {
                      e.preventDefault();
                      e.target.blur();
                      sendMessage();
                    }
                  }}
                />
                {idx === comparePlayers.length - 1 && comparePlayers.length < 10 && (
                  <button onClick={() => setComparePlayers([...comparePlayers, ""])} className="add-player-button">+ Add Player</button>
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
                  key={`A-${idx}`}
                  type="text"
                  list="player-options"
                  placeholder={`Team A Player ${idx + 1}`}
                  value={player}
                  onChange={(e) => {
                    const updated = [...teamA];
                    updated[idx] = e.target.value;
                    setTeamA(updated);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && idx === teamA.length - 1) {
                      e.preventDefault();
                      e.target.blur();
                      sendMessage();
                    }
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
                  key={`B-${idx}`}
                  type="text"
                  list="player-options"
                  placeholder={`Team B Player ${idx + 1}`}
                  value={player}
                  onChange={(e) => {
                    const updated = [...teamB];
                    updated[idx] = e.target.value;
                    setTeamB(updated);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && idx === teamB.length - 1) {
                      e.preventDefault();
                      e.target.blur();
                      sendMessage();
                    }
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

        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>

      <datalist id="player-options">
        {playerSuggestions.map((name, idx) => (
          <option key={idx} value={name} />
        ))}
      </datalist>
    </div>
  );
};

export default ChatInterface;
