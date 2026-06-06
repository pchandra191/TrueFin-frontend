import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { getBorrowers, Borrower } from "../../apis/BorrowerApis";
import { Icon } from "../utilities/utilities";
import { DataTable } from "./DataTable";
import { BorrowerDrawer } from "./BorrowerDrawer";
import { useSEO } from "../seo";

const CITIES = [
  { id: 1, name: "Shahjahanpur" },
  { id: 2, name: "Bareilly" },
  { id: 3, name: "Tilhar" },
  { id: 4, name: "Katra" },
  { id: 5, name: "Haldwani" },
  { id: 6, name: "Dehradun" },
  { id: 7, name: "Moradabad" },
];

const CitySelect = memo(({ value, onChange }: { value: number; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => {
  const cityOptions = useMemo(() =>
    CITIES.map((city) => (
      <option key={city.id} value={city.id}>
        {city.name}
      </option>
    )),
  []);

  return (
    <select
      value={value}
      onChange={onChange}
      style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
    >
      {cityOptions}
    </select>
  );
});
CitySelect.displayName = "CitySelect";

function getCached<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { data: T; timestamp: number };
    if (Date.now() - parsed.timestamp > 10 * 60 * 1000) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function BorrowerManagementScreen({
  drawerOpen,
  onDrawerToggle,
  onAddBorrower,
}: {
  drawerOpen: boolean;
  onDrawerToggle: () => void;
  onAddBorrower: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCityId, setSelectedCityId] = useState(CITIES[0].id);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const { setSEO } = useSEO();

  // Initialize from cache immediately
  const [borrowers, setBorrowers] = useState<Borrower[]>(() => {
    const cacheKey = `tf_cache_med_borrowers_${selectedCityId}_${search}_${page}_50`;
    const cached = getCached<BorrowersResponse>(cacheKey);
    return cached?.borrowers || [];
  });

  useEffect(() => {
    const cached = getCached<BorrowersResponse>(`tf_cache_med_borrowers_${selectedCityId}_${search}_${page}_50`);
    if (cached) {
      setBorrowers(cached.borrowers);
      setTotalPages(cached.pagination?.pages || 1);
      return;
    }
    setLoading(true);
    getBorrowers({ cityId: selectedCityId, search: search || undefined, page, limit: 50 })
      .then(res => {
        setBorrowers(res.borrowers);
        setTotalPages(res.pagination.pages);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedCityId, search, page]);

  const handleSelectBorrower = useCallback((borrower: Borrower) => {
    setSelectedBorrower(borrower);
    if (!drawerOpen) onDrawerToggle();
    setSEO({
      title: `${borrower.name} - Loan Details`,
      description: `View installment history and payment status for ${borrower.name}. Total paid: ₹${borrower.installments.reduce((sum, i) => sum + (i.status === 'paid' ? i.amount : 0), 0).toLocaleString()}.`,
    });
  }, [drawerOpen, onDrawerToggle, setSEO]);

  useEffect(() => {
    if (selectedBorrower) {
      setSEO({
        title: `${selectedBorrower.name} - Loan Details | TrueFin`,
        description: `View installment history and payment status for ${selectedBorrower.name}. Track payments and manage loan details.`,
      });
    }
  }, [selectedBorrower, setSEO]);

  const handleCityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCityId(Number(e.target.value));
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handlePrevPage = useCallback(() => setPage((p) => p - 1), []);
  const handleNextPage = useCallback(() => setPage((p) => p + 1), []);

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
          <CitySelect value={selectedCityId} onChange={handleCityChange} />

          <div className="search" style={{ flex: 1 }}>
            <Icon name="search" />
            <input
              placeholder="Search borrowers by name..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <DataTable
          rows={borrowers}
          loading={loading && borrowers.length === 0}
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
                onClick={handlePrevPage}
              >
                <Icon name="chevron_left" />
              </button>
              <button
                className="icon-button"
                disabled={page >= totalPages}
                onClick={handleNextPage}
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
        onUpdate={() => getBorrowers({ cityId: selectedCityId, search: search || undefined, page, limit: 50 }).then(r => setBorrowers(r.borrowers))}
      />
    </>
  );
}

interface BorrowersResponse {
  borrowers: Borrower[];
  pagination: { pages: number };
}

export default memo(BorrowerManagementScreen);
