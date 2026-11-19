import { useState } from "react";
import movies from "../movies.json";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div style={{ backgroundColor: "#141414", minHeight: "100vh", color: "#fff", padding: "16px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#e50914", marginBottom: "16px" }}>KURDMIRA</h1>
      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Trending Now</h2>

      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "12px" }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            style={{ minWidth: "140px", cursor: "pointer" }}
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{ width: "140px", height: "210px", objectFit: "cover", borderRadius: "6px" }}
            />
            <p style={{ fontSize: "14px", marginTop: "6px" }}>{movie.title}</p>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
            zIndex: 50,
          }}
        >
          <button
            onClick={() => setSelectedMovie(null)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              backgroundColor: "#e50914",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "4px",
              fontSize: "15px",
            }}
          >
            ✕ Close
          </button>

          <h3 style={{ marginBottom: "12px", textAlign: "center" }}>{selectedMovie.title}</h3>
          <video
            src={selectedMovie.videoUrl}
            controls
            autoPlay
            playsInline
            style={{ width: "100%", maxWidth: "800px", maxHeight: "75vh", borderRadius: "8px" }}
          />
          {selectedMovie.description && (
            <p style={{ marginTop: "12px", color: "#ccc", fontSize: "14px", textAlign: "center", maxWidth: "600px" }}>
              {selectedMovie.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
