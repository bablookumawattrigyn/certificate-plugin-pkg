import { CertIcon } from './CertIcon';

type StatAccent = 'blue' | 'emerald' | 'violet' | 'amber';

interface StatTileProps {
  icon: string;
  label: string;
  value: number | string;
  hint?: string;
  accent?: StatAccent;
}

export function StatTile({ icon, label, value, hint, accent = 'blue' }: StatTileProps) {
  return (
    <div className={`cert-stat-tile cert-stat-tile--${accent}`}>
      <CertIcon name={icon} className="cert-stat-tile__icon" size="2.16rem" />
      <div>
        <p className="cert-stat-tile__label">{label}</p>
        <p className="cert-stat-tile__value">{value}</p>
        {hint && <p className="cert-stat-tile__hint">{hint}</p>}
      </div>
    </div>
  );
}
