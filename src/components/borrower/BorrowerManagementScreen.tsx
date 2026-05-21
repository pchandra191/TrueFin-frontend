import { useState, useEffect } from "react";
import { getBorrowers, Borrower } from "../../apis/BorrowerApis";
import { Icon } from "../utilities/utilities";
import { DataTable } from "./DataTable";
import { BorrowerDrawer } from "./BorrowerDrawer";

// City map — update cityId values to match your data
const CITIES = [
  { id: 1, name: "Shahjahanpur" },
  { id: 2, name: "Bareilly" },
  { id: 3, name: "Tilhar" },
  { id: 4, name: "Katra" },
  { id: 5, name: "Haldwani" },
  { id: 6, name: "Dehradun" },
  { id: 7, name: "Moradabad" },
];

export function BorrowerManagementScreen({
  drawerOpen,
  onDrawerToggle,
  onAddBorrower,
}: {
  drawerOpen: boolean;
  onDrawerToggle: () => void;
  onAddBorrower: () => void;
}) {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCityId, setSelectedCityId] = useState(CITIES[0].id);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  async function fetchBorrowers(updatedBorrower?: Borrower) {
    setLoading(true);
    setError("");
    try {
      const res = await getBorrowers({
        cityId: selectedCityId,
        search: search || undefined,
        page,
        limit: 50,
      });
      setBorrowers(res.borrowers);
      setTotalPages(res.pagination.pages);
      if (updatedBorrower) {
        setSelectedBorrower(updatedBorrower);
      } else if (selectedBorrower) {
        const refreshed = res.borrowers.find((b) => b.uniqueId === selectedBorrower.uniqueId);
        if (refreshed) setSelectedBorrower(refreshed);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load borrowers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBorrowers();
  }, [selectedCityId, page]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => fetchBorrowers(), 400);
    return () => clearTimeout(t);
  }, [search]);

  function handleSelectBorrower(borrower: Borrower) {
    setSelectedBorrower(borrower);
    if (!drawerOpen) onDrawerToggle();
  }

  return (
    <>
      <main className={`content borrowers ${drawerOpen ? "with-drawer" : ""}`}>
        <div className="page-heading">
          <div>
            <h2>Borrowers</h2>
            <p>Manage your loan portfolios and active credit users.</p>
          </div>
          <button className="primary-button" onClick={onAddBorrower}>
            <Icon name="add" /> Add Borrower
          </button>
        </div>

        {/* Filters */}
        <div className="filters-row" style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <select
            value={selectedCityId}
            onChange={(e) => { setSelectedCityId(Number(e.target.value)); setPage(1); }}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
          >
            {CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          <div className="search" style={{ flex: 1 }}>
            <Icon name="search" />
            <input
              placeholder="Search borrowers by name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <DataTable
          rows={borrowers}
          loading={loading}
          onSelect={handleSelectBorrower}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="table-footer">
            <span>Page {page} of {totalPages}</span>
            <div>
              <button
                className="icon-button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <Icon name="chevron_left" />
              </button>
              <button
                className="icon-button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        )}
      </main>

      <BorrowerDrawer
        borrower={selectedBorrower}
        open={drawerOpen && !!selectedBorrower}
        onClose={onDrawerToggle}
        onUpdate={fetchBorrowers}
      />
    </>
  );
}

export default BorrowerManagementScreen;
