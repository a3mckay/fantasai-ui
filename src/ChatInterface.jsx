import React, { useState, useEffect, useRef } from "react";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [comparePlayers, setComparePlayers] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("summary");
  const chatBoxRef = useRef(null);

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
    if (!input.trim()) return;

    let apiUrl = "";
    if (mode === "summary") {
      apiUrl = `https://fantasai-test-production.up.railway.app/player/${encodeURIComponent(input)}`;
    } else if (mode === "analyze") {
      apiUrl = `https://fantasai-test-production.up.railway.app/analysis/${encodeURIComponent(input)}`;
    } else if (mode === "compare" && player2.trim()) {
      apiUrl = `https://fantasai-test-production.up.railway.app/compare?player1=${encodeURIComponent(input)}&player2=${encodeURIComponent(player2)}&context=Standard%20Comparison`;
    } else {
      return;
    }

    console.log("📩 Before state update (messages):", messages);
    
    const newMessages = [
      ...messages,
      {
        text: `📢 **${mode.toUpperCase()} Mode**: ${input}${player2 ? ` vs ${player2}` : ""}`,
        sender: "user",
      },
    ];

    console.log("📩 After user input (newMessages):", newMessages); // Debugging
    
    setMessages(newMessages);
    
    setMessages(newMessages);

    console.log("📩 All Messages:", newMessages); // For debugging
    
    setInput("");
    setPlayer2("");
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log("🌍 API Response Data:", data); // Debugging: Check full API response

      if (data.error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "⚠️ Error: " + data.error, sender: "bot" },
        ]);
      } else {
        if (mode === "compare") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: `⚖ **Comparison**\n${data.comparison}`, sender: "bot" },
          ]);
        } else if (mode === "analyze") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: `🔍 **Analysis** for ${input}\n${data.openai_analysis}`, sender: "bot" },
          ]);
        } else {
          setMessages((prevMessages) => {
            console.log("📩 Before bot response (prevMessages):", prevMessages);
            console.log("📩 API Response Being Added:", `📊 **${data.player_name}**\n${data.summary}`);

            return [
              ...prevMessages,
              { text: `📊 **${data.player_name}**\n${data.summary}`, sender: "bot" }
            ];
          });
        }
      } // ✅ Now the `if`/`else` structure is properly closed

    } catch (error) {  // ✅ `catch` is now correctly placed
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "⚠️ Error fetching data.", sender: "bot" },
      ]);
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
      </div>

      {/* Input Box */}
      <div className="input-box">
        <input
          type="text"
          placeholder={
            mode === "compare" ? "Enter first player..." : "Ask about a player..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e)=> {
            if (e.key === "Enter") {
              sendMessage();
            }
          
          }}
        />
        {mode === "compare" && (
          <div className="compare-inputs">
            {comparePlayers.map((player, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
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
                {/* Only show Add Player under the last field */}
                {idx === comparePlayers.length - 1 && comparePlayers.length < 10 && (
                  <button
                    onClick={() => setComparePlayers([...comparePlayers, ""])}
                    style={{ marginTop: "5px" }}
                  >
                    + Add Player
                  </button>
                )}
              </div>
            ))}
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
