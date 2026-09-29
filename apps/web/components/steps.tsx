interface Step {
  name: string;
  text: string;
}

const defaultSteps: Step[] = [
  { name: "Point", text: "Click anything on your running UI." },
  { name: "Prompt", text: "Describe what you want changed." },
  { name: "Collect", text: "Keep reviewing. EditUI remembers every edit." },
  { name: "Send", text: "Copy the whole review and paste it into your coding agent." },
];

export function Steps({ steps = defaultSteps, showShorthand = true }: { steps?: Step[]; showShorthand?: boolean }) {
  return (
    <div>
      {showShorthand ? (
        <p className="text-sm tracking-wide text-muted">Point → Prompt → Collect → Send</p>
      ) : null}
      <ol className={`grid gap-4 sm:grid-cols-2 ${showShorthand ? "mt-6" : ""} lg:grid-cols-4`}>
        {steps.map((step, index) => (
          <li key={step.name} className="rounded-2xl border border-line bg-card p-4">
            <p className="text-xs font-medium text-accent">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 text-base font-medium">{step.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
