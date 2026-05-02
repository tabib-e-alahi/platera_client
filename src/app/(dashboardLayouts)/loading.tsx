export default function DashboardLoading() {
  return (
    <div style={{
      display: "flex",
      minHeight: "100dvh",
      background: "hsl(30 33% 97%)",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* sidebar skeleton */}
      <div style={{
        width: 240,
        background: "linear-gradient(180deg, hsl(20 15% 8%), hsl(350 30% 12%))",
        flexShrink: 0,
      }} />
      {/* content skeleton */}
      <div style={{ flex: 1, padding: "36px 40px" }}>
        <div style={{
          height: 28,
          width: 220,
          borderRadius: 8,
          background: "hsl(30 20% 90%)",
          marginBottom: 24,
          animation: "pulse 1.5s ease-in-out infinite",
        }} />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {[1,2,3].map((i) => (
            <div key={i} style={{
              height: 100,
              borderRadius: 14,
              background: "#ffffff",
              border: "1px solid #E2E8F0",
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}