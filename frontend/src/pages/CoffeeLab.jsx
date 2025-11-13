// frontend/src/pages/Lab.jsx
import React, { useEffect, useState } from "react";
import FlavorWheel from "../components/FlavourWheel";
import BrewMixer from "../components/BrewMixer";
import { inferFlavors } from "../components/flavourEngine";
import "../index.css";

export default function CoffeeLab() {
  const [flavors, setFlavors] = useState([]);
  const [selection, setSelection] = useState([]);
  const [params, setParams] = useState({
    brewMethod: "Pour-over",
    roastLevel: "Medium",
    grindSize: "Medium",
    ratio: 1 / 16,
    tempC: 93,
  });
  const [predicted, setPredicted] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function loadFlavors() {
      try {
        const res = await fetch("/api/flavors");
        console.log("✅ /api/flavors status:", res.status);
        const data = await res.json();
        if (!cancelled) {
          console.log("✅ Flavors loaded:", data);
          setFlavors(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("❌ Failed loading flavors:", err);
        // graceful fallback palette
        if (!cancelled) {
          setFlavors([
            { name: "Chocolate", category: "Sweet", hue: "#6b4c3b" },
            { name: "Citrus", category: "Fruity", hue: "#ffd166" },
            { name: "Floral", category: "Floral", hue: "#f7c6d0" },
            { name: "Nutty", category: "Nutty", hue: "#a67c52" },
          ]);
        }
      }
    }

    loadFlavors();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      const result = inferFlavors(params, selection);
      setPredicted(result || []);
    } catch (err) {
      console.warn("inferFlavors error:", err);
      setPredicted([]);
    }
  }, [params, selection]);

  // Save a log of the current experiment (best-effort; falls back to local)
  async function saveLog() {
    const payload = {
      params,
      predicted,
      selection,
      notes: "",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      alert("☕ Cupping log saved!");
    } catch (err) {
      console.warn("Save log failed (offline?):", err);
      // fallback: save locally so user doesn't lose their experiment
      try {
        const backups = JSON.parse(localStorage.getItem("labLogs") || "[]");
        backups.push(payload);
        localStorage.setItem("labLogs", JSON.stringify(backups));
        alert("☕ Saved locally (offline).");
      } catch (e) {
        console.error("Local save failed:", e);
        alert("⚠️ Could not save log.");
      }
    }
  }

  return (
    <div className="coffee-lab-root">
      <header className="coffee-lab-header">
        <div className="brand">☕ BEANie Coffee Lab</div>
        <p className="tag">Mix, explore, and discover your perfect flavor.</p>
      </header>

      <main className="coffee-lab-main">
        <section className="coffee-lab-left">
          <FlavorWheel
            flavors={flavors}
            selection={selection}
            setSelection={setSelection}
            className="coffee-lab-wheel-card"
          />
        </section>

        <section className="coffee-lab-right">
          <div className="coffee-lab-mixer">
            <BrewMixer params={params} setParams={setParams} predicted={predicted} />
          </div>

          <div className="coffee-lab-actions">
            <button className="coffee-lab-save" onClick={saveLog}>
              Save Cupping Log
            </button>
          </div>
        </section>
      </main>

      <footer className="coffee-lab-foot">© BEANie Coffee Lab 2025</footer>
    </div>
  );
}