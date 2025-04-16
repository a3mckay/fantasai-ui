import React, { useState } from "react";
import "../App.css";

const WriterDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [previewResponse, setPreviewResponse] = useState("");
  const [playerRowLimit, setPlayerRowLimit] = useState(10);


  return (
    <div className="app-container" style={{ padding: "40px 20px", alignItems: "stretch" }}>
      <h1 className="hero-text">🧠 Writer Dashboard</h1>

      {/* === Tab Selector === */}
      <div className="mode-selector" style={{ marginBottom: "20px" }}>
        <button
          className={`writer-dashboard-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile Info
        </button>
        <button
          className={`writer-dashboard-tab ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          📊 Analytics
        </button>
      </div>





      {/* === Profile Info Tab === */}
      {activeTab === "profile" && (
        <>
          {/* === Profile Info === */}
          <div className="section-card">
            <h2 className="highlight-box">👤 Profile Info</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                maxWidth: "720px",
                margin: "1rem auto",
                width: "100%",
              }}
            >
              <div className="writer-input-box">
                <input className="input-field" placeholder="Display Name" />
              </div>
              <div className="writer-input-box">
                <input className="input-field" placeholder="Real Name (optional)" />
              </div>
              <div className="writer-input-box">
                <input className="input-field" placeholder="Email Address" />
              </div>
              <div className="writer-input-box">
                <input className="input-field" placeholder="Primary Website" />
              </div>
            </div>

            {/* Upload Avatar centered */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
              <div className="writer-input-box" style={{ alignItems: "center" }}>
                <label className="highlight-box block mb-2">🖼️ Upload Avatar/Icon</label>
                <input type="file" accept="image/*" className="input-field" />
              </div>
            </div>

            {/* Social Media Handles */}
            <h3 className="mt-6 mb-2 text-md font-semibold">📱 Social Media Handles (optional)</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                maxWidth: "720px",
                margin: "1rem auto",
                width: "100%",
              }}
            >
              {[
                "Twitter / X", "Facebook", "Instagram", "TikTok",
                "Threads", "Bluesky", "Patreon", "Substack",
              ].map((platform) => (
                <div className="writer-input-box" key={platform}>
                  <input className="input-field" placeholder={platform} />
                </div>
              ))}
            </div>
          </div>

          {/* === Rankings Upload === */}
          <div className="section-card">
            <h2 className="highlight-box">📈 Upload Rankings</h2>
            <p className="text-sm text-gray-600 mb-2">
              Upload your latest rankings as a .csv or .xlsx file. This will be used for all queries until a new one is uploaded.
            </p>
            <div className="writer-input-box">
              <input type="file" accept=".csv,.xlsx" className="input-field" />
              <select className="input-field mt-2">
                <option value="">Select Sport</option>
                <option value="mlb">MLB</option>
                <option value="nba">NBA</option>
                <option value="nfl">NFL</option>
              </select>
              {/* Uploaded Rankings Table */}
              <div style={{ marginTop: "1.5rem" }}>
                <h3 className="table-title">📂 Uploaded Rankings</h3>
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Date Uploaded</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>📈 MLB Rankings</td>
                      <td>Apr 8, 2025</td>
                      <td><button className="add-player-button" style={{ width: "auto" }}>🗑️ Delete</button></td>
                    </tr>
                    <tr>
                      <td>📈 NBA Rankings</td>
                      <td>Apr 5, 2025</td>
                      <td><button className="add-player-button" style={{ width: "auto" }}>🗑️ Delete</button></td>
                    </tr>
                  </tbody>
                </table>
                <button className="button" style={{ backgroundColor: "#d32f2f", marginTop: "12px" }}>
                  🧹 Delete All Rankings
                </button>
              </div>


            </div>
          </div>

{/* === Training Article Upload === */}
          <div className="section-card">
            <h2 className="highlight-box">📚 Upload Training Articles</h2>
            <p className="text-sm text-gray-600 mb-2">
              Upload 3–10 articles (~2,000+ words total) to improve tone/style matching. Accepts <code>.txt</code> and <code>.docx</code>.
            </p>
            <div className="writer-input-box">
              <input type="file" accept=".txt,.docx" multiple className="input-field" />
            </div>
            {/* Uploaded Articles Table */}
            <div style={{ marginTop: "1.5rem" }}>
              <h3 className="table-title">📚 Uploaded Articles</h3>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Date Uploaded</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>📝 article_march_tiers.docx</td>
                    <td>Apr 7, 2025</td>
                    <td><button className="add-player-button" style={{ width: "auto" }}>🗑️ Delete</button></td>
                  </tr>
                  <tr>
                    <td>📝 dynasty_undervalues.txt</td>
                    <td>Apr 6, 2025</td>
                    <td><button className="add-player-button" style={{ width: "auto" }}>🗑️ Delete</button></td>
                  </tr>
                </tbody>
              </table>
              <button className="button" style={{ backgroundColor: "#d32f2f", marginTop: "12px" }}>
                🧹 Delete All Articles
              </button>
            </div>

            </div>

          {/* === Bot Customization === */}
          <div className="section-card">
            <h2 className="highlight-box">🎨 Customize Bot</h2>
            <div className="writer-input-box">
              <input className="input-field" placeholder="Tone (e.g., friendly, serious)" />
              <input className="input-field" placeholder="Style (e.g., lists, rhyming)" />
              <input className="input-field" placeholder="Voice (e.g., scout, blogger)" />
              <input className="input-field" placeholder="Response Creativity (e.g., safe, bold)" />
              <input className="input-field" placeholder="Response Length (e.g., 2–5 sentences)" />
            </div>
          </div>

          {/* === Preview Area === */}
          <div className="section-card">
            <h2 className="highlight-box">🧪 Preview</h2>
            <div className="chat-box mt-3 mb-4" style={{ backgroundColor: "#f5f5f5", color: "black", minHeight: "120px" }}>
              {previewResponse ? previewResponse : <em className="text-gray-500">Your preview will appear here...</em>}
            </div>
            <button
              className="add-player-button"
              onClick={() => setPreviewResponse("Here's how your bot might respond to a Mike Trout query...")}
            >
              ⚡ Generate Preview
            </button>
          </div>

          {/* === Save / Delete Buttons === */}
          <div className="writer-input-box" style={{ marginTop: "20px", gap: "20px" }}>
            <button className="button" style={{ backgroundColor: "#007bff" }}>
              💾 Save Profile
            </button>
            <button className="button" style={{ backgroundColor: "#d32f2f" }}>
              🗑️ Delete All Files
            </button>
          </div>

          {/* === Disclaimer === */}
          <div style={{ marginTop: "30px", fontSize: "0.85rem", color: "#ccc", textAlign: "center" }}>
            <p>🔒 We will never copy, sell, or reuse your content. You control your data.</p>
            <p>📊 We only use anonymized query logs to improve your bot and platform analytics.</p>
          </div>
        </>
      )}

      {activeTab === "analytics" && (
        <div className="section-card">
          <h2 className="highlight-box">📊 Analytics</h2>

          {/* === Usage Summary Table === */}
          <h3 className="table-title">🔍 Usage Summary</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>👥 Users</td><td>123</td></tr>
              <tr><td>💬 Total Queries</td><td>452</td></tr>
              <tr><td>📄 Summary Used</td><td>230</td></tr>
              <tr><td>🔍 Compare Used</td><td>145</td></tr>
              <tr><td>📦 Trade Used</td><td>77</td></tr>
            </tbody>
          </table>

          {/* === Most Queried Players === */}
          <h3 className="table-title">📈 Most Queried Players</h3>
          <div style={{ marginBottom: "10px", textAlign: "right" }}>
            Show rows:
            <select className="analytics-dropdown">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Total Mentions</th>
                <th>Summary</th>
                <th>Compare</th>
                <th>Trade</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Mike Trout</td><td>32</td><td>10</td><td>12</td><td>10</td></tr>
              <tr><td>Juan Soto</td><td>29</td><td>8</td><td>15</td><td>6</td></tr>
              <tr><td>Aaron Judge</td><td>24</td><td>5</td><td>11</td><td>8</td></tr>
            </tbody>
          </table>




          {/* === Feature Usage === */}
          <h3 className="table-title">🧩 Feature Usage</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Uses</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Summary</td><td>230</td></tr>
              <tr><td>Compare</td><td>145</td></tr>
              <tr><td>Trade</td><td>77</td></tr>
            </tbody>
          </table>


          {/* === Recent Queries Table (Pagination Placeholder) === */}
          <h3 className="table-title">📝 Recent Queries</h3>
          <div style={{ marginBottom: "10px", textAlign: "right" }}>
            Show rows:
            <select className="analytics-dropdown">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Players</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Compare</td><td>Soto vs. Judge</td><td>Apr 9, 2025</td></tr>
              <tr><td>Summary</td><td>Mike Trout</td><td>Apr 9, 2025</td></tr>
              <tr><td>Trade</td><td>Carroll for Chourio</td><td>Apr 8, 2025</td></tr>
            </tbody>
          </table>


          {/* === Revenue & Referrals Table === */}
          <h3 className="table-title">💸 Revenue & Referrals</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>💰 Total Revenue</td><td>$89.50</td></tr>
              <tr><td>👋 Referrals</td><td>18</td></tr>
              <tr><td>🔗 Article Clicks</td><td>72</td></tr>
            </tbody>
          </table>

          {/* === Traffic to Website / Socials === */}
          <h3 className="table-title">🌐 Traffic to Website & Socials</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Primary Website</td><td>58</td></tr>
              <tr><td>Twitter / X</td><td>31</td></tr>
              <tr><td>Patreon</td><td>12</td></tr>
            </tbody>
          </table>
        </div>
      )}

        </div>
      );
    };


export default WriterDashboard;
