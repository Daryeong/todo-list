export const StatusIcon = ({ label, tone }: { label: string; tone: 'warm' | 'alert' | 'calm' }) => (
  <span aria-label={label} className={`status-chip status-chip--${tone}`} title={label}>
    {label}
  </span>
)
