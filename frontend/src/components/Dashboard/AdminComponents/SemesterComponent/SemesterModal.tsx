import { IconCalendar, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../../constants/storage";
import { toastError, toastSuccess } from "../../../../lib/toast";

interface Semester {
  id: number;
  name: string;
  year: string;
  type: "WINTER" | "SUMMER";
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

interface FormData {
  year: string;
  type: "WINTER" | "SUMMER";
  startDate: string;
  endDate: string;
}

const EMPTY_FORM: FormData = {
  year: "",
  type: "WINTER",
  startDate: "",
  endDate: "",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SemesterModal({ isOpen, onClose }: Props) {
  const [page, setPage] = useState<1 | 2>(1);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Semester | null>(null);

  useEffect(() => {
    if (isOpen) fetchSemesters();
  }, [isOpen]);

  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/semester`);
      if (!res.ok) throw new Error();
      setSemesters(await res.json());
    } catch {
      toastError("Greška pri učitavanju semestara");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.year.trim()) {
      toastError("Unesite akademsku godinu");
      return;
    }
    if (!form.startDate) {
      toastError("Unesite datum početka");
      return;
    }
    if (!form.endDate) {
      toastError("Unesite datum završetka");
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toastError("Datum završetka mora biti nakon datuma početka");
      return;
    }
    try {
      const url = editId
        ? `${BACKEND_URL}/api/semester/${editId}`
        : `${BACKEND_URL}/api/semester`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      toastSuccess(editId ? "Semestar ažuriran!" : "Semestar kreiran!");
      setForm(EMPTY_FORM);
      setEditId(null);
      fetchSemesters();
      setPage(2);
    } catch (err: any) {
      toastError(err.message || "Greška pri snimanju");
    }
  };

  const handleEdit = (s: Semester) => {
    setForm({
      year: s.year,
      type: s.type,
      startDate: s.startDate.slice(0, 10),
      endDate: s.endDate.slice(0, 10),
    });
    setEditId(s.id);
    setPage(1);
  };

  const handleCancelEdit = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/semester/${deleteTarget.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      toastSuccess("Semestar obrisan");
      setSemesters((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      toastError("Greška pri brisanju");
    }
  };

  const handleActivate = async (id: number) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/semester/${id}/activate`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error();
      toastSuccess("Semestar aktiviran!");
      fetchSemesters();
    } catch {
      toastError("Greška pri aktiviranju");
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-blue-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <IconCalendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-syne font-bold text-white leading-tight">
                  Upravljanje Semestrima
                </h2>
                <p className="text-blue-100 text-xs">
                  {page === 1
                    ? editId
                      ? "Uredi semestar"
                      : "Kreiraj novi semestar"
                    : "Pregled svih semestara"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white px-6 pt-4 pb-0 border-b border-slate-200">
            <div className="flex gap-1">
              <button
                onClick={() => setPage(1)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${
                  page === 1
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-500 border-transparent hover:text-slate-700"
                }`}
              >
                {editId ? "Uredi Semestar" : "Dodaj Semestar"}
              </button>
              <button
                onClick={() => setPage(2)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${
                  page === 2
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-500 border-transparent hover:text-slate-700"
                }`}
              >
                Svi Semestri
                <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                  {semesters.length}
                </span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-190px)] p-6">
            {page === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Akademska godina
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
                    placeholder='npr. "2025/2026"'
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Tip semestra
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
                    required
                  >
                    <option value="WINTER">Zimski</option>
                    <option value="SUMMER">Ljetni</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Datum početka
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Datum završetka
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {editId ? (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Odustani od uređivanja
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Odustani
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm"
                  >
                    {editId ? "Sačuvaj izmjene" : "Kreiraj Semestar"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-600" />
                  </div>
                ) : semesters.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconCalendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">
                      Nema kreiranih semestara
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      Dodajte prvi semestar preko forme
                    </p>
                  </div>
                ) : (
                  semesters.map((s) => (
                    <div
                      key={s.id}
                      className={`border rounded-xl p-4 transition-colors ${
                        s.isActive
                          ? "border-green-200 bg-green-50"
                          : "border-slate-200 hover:border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              s.type === "WINTER"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}
                          >
                            {s.type === "WINTER" ? "❄️ Zimski" : "☀️ Ljetni"}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {s.year}
                          </span>
                          {s.isActive && (
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                              ✓ Aktivan
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!s.isActive && (
                            <button
                              onClick={() => handleActivate(s.id)}
                              className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Aktiviraj
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(s)}
                            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 rounded-lg text-xs font-medium transition-colors"
                          >
                            Uredi
                          </button>
                          <button
                            onClick={() => setDeleteTarget(s)}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                          >
                            <IconX className="w-3 h-3" />
                            Obriši
                          </button>
                        </div>
                      </div>
                      <h3 className="text-sm font-nuni font-bold text-slate-800 mb-1">
                        {s.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {formatDate(s.startDate)} — {formatDate(s.endDate)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Zatvori
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-500 px-6 py-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <IconX className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-syne font-bold text-white leading-tight">
                  Potvrda Brisanja
                </h2>
                <p className="text-red-100 text-xs">
                  Ova akcija se ne može poništiti
                </p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-slate-600 text-sm mb-2">
                Da li ste sigurni da želite obrisati semestar:
              </p>
              <p className="font-syne font-bold text-slate-800 mb-3">
                "{deleteTarget.name}"
              </p>
              <p className="text-xs text-slate-500">
                Ova akcija će trajno ukloniti semestar iz sistema.
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Otkaži
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-5 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                Obriši Semestar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
