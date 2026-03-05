import "./style.scss";

// ─── Pagination Component ─────────────────────────────────────
// Props:
//   currentPage  — abhi kaun sa page hai (number)
//   totalPages   — total kitne pages hain (number)
//   onPageChange — page change hone pe call hoga (function)

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // sirf ek page ho to dikhao hi mat

  // ── Page numbers generate karo (with dots) ─────────────────
  function getPages() {
    const pages = [];
    const delta = 2; // current ke aage peeche kitne pages dikhao

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||                          // pehla page hamesha
        i === totalPages ||                 // aakhri page hamesha
        (i >= currentPage - delta && i <= currentPage + delta) // current ke aas paas
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== "..."
      ) {
        pages.push("...");                  // gap dikhao
      }
    }
    return pages;
  }

  const pages = getPages();

  return (
    <div className="pagination">

      {/* Previous button */}
      <button
        className="pgBtn pgBtn--prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15,18 9,12 15,6" />
        </svg>
        <span>Pehle</span>
      </button>

      {/* Page numbers */}
      <div className="pgNumbers">
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="pgDots">•••</span>
          ) : (
            <button
              key={page}
              className={`pgNum ${page === currentPage ? "pgNum--active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next button */}
      <button
        className="pgBtn pgBtn--next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span>Agle</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>

    </div>
  );
}