export default function FaixaDemo() {
  return (
    <div
      style={{
        position: "fixed",
        insetInline: 0,
        top: 0,
        zIndex: 50,
        background: "#0C1614",
        color: "#FFFEF8",
        textAlign: "center",
        padding: "0.65rem 1rem",
        fontSize: "0.92rem",
      }}
    >
      Este é um site de exemplo.{" "}
      <a
        href="/"
        style={{
          fontWeight: 700,
          textDecoration: "underline",
          textUnderlineOffset: "0.2em",
          color: "#F5B942",
        }}
      >
        Voltar para a kdiff
      </a>
    </div>
  );
}
