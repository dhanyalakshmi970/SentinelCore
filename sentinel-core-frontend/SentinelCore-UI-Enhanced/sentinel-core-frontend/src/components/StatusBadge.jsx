const map = {
  ONLINE:'success', HEALTHY:'success', COMPLIANT:'success', RESOLVED:'success', CLOSED:'success', PATCHED:'success', LOW:'neutral',
  WARNING:'warning', REVIEW_REQUIRED:'warning', MEDIUM:'warning', IN_PROGRESS:'info', ACKNOWLEDGED:'info', OPEN:'danger', HIGH:'danger', NON_COMPLIANT:'danger', CRITICAL:'critical', OFFLINE:'critical'
};
export default function StatusBadge({value}) { const text = String(value ?? '—').replaceAll('_',' '); return <span className={`status-badge ${map[String(value)] || 'neutral'}`}><span className="status-dot"/>{text}</span>; }
