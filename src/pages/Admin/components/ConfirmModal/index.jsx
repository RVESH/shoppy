import "./style.scss";

export default function ConfirmModal({ msg, onConfirm, onClose }) {
  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-box" onClick={e => e.stopPropagation()}>
        <div className="cm-icon">🗑️</div>
        <h3>Delete karo?</h3>
        <p>{msg}</p>
        <div className="cm-btns">
          <button className="cm-cancel" onClick={onClose}>Cancel</button>
          <button className="cm-confirm" onClick={onConfirm}>Haan, Delete Karo</button>
        </div>
      </div>
    </div>
  );
}