import {
  IconBook,
  IconCalendarTime,
  IconCheck,
  IconClipboardList,
  IconClock,
  IconDownload,
  IconUpload,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useAuth } from "../../Context";
import useStudentAssignments, {
  StudentAssignment,
} from "../../hooks/studentHooks/useStudentAssignments";

const STATUS_CONFIG = {
  GRADED: {
    label: "Ocijenjeno",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  PENDING: {
    label: "Predano — čeka ocjenu",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
} as const;

function AssignmentCard({
  assignment,
  uploadingId,
  onSubmit,
  onDownload,
}: {
  assignment: StudentAssignment;
  uploadingId: number | null;
  onSubmit: (assignment: StudentAssignment, file: File) => void;
  onDownload: (s3Path: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isUploading = uploadingId === assignment.id;
  const isOverdue = new Date(assignment.dueDate) < new Date();
  const { submission } = assignment;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    onSubmit(assignment, selectedFile);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded font-medium">
              {assignment.type}
            </span>
            {assignment.difficulty && (
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium ${
                  assignment.difficulty === "LAGAN"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : assignment.difficulty === "TESKO"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                }`}
              >
                {assignment.difficulty === "LAGAN"
                  ? "Lagan"
                  : assignment.difficulty === "TESKO"
                    ? "Težak"
                    : "Srednje"}
              </span>
            )}
            <span className="text-xs text-neutral-400">
              {assignment.subject.code}
            </span>
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
            {assignment.title}
          </h3>
          {assignment.description && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {assignment.description}
            </p>
          )}
        </div>
        <div className="text-right ml-4 shrink-0">
          <p className="text-xl font-bold text-neutral-900 dark:text-white">
            {submission?.status === "GRADED"
              ? `${submission.pointsEarned}/${assignment.maxPoints}`
              : `—/${assignment.maxPoints}`}
          </p>
          <p className="text-xs text-neutral-400">bodova</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        <span
          className={`flex items-center gap-1 ${isOverdue ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}
        >
          <IconCalendarTime className="h-3.5 w-3.5" />
          Rok: {new Date(assignment.dueDate).toLocaleDateString("bs-BA")}
          {isOverdue ? " (isteklo)" : ""}
        </span>
        <span className="flex items-center gap-1">
          <IconClock className="h-3.5 w-3.5" />
          {assignment.maxPoints} bodova
        </span>
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-neutral-100 dark:border-neutral-700">
        {/* Download professor file */}
        {assignment.professorS3Path && (
          <button
            onClick={() => onDownload(assignment.professorS3Path!)}
            className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-lg transition-all font-medium"
          >
            <IconDownload className="h-4 w-4" />
            Preuzmi zadatak
          </button>
        )}

        {/* Submit section */}
        {submission?.status === "GRADED" ? (
          <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <IconCheck className="h-3.5 w-3.5" />
            {STATUS_CONFIG.GRADED.label}
          </span>
        ) : submission?.status === "PENDING" ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
              <IconCheck className="h-3.5 w-3.5" />
              {STATUS_CONFIG.PENDING.label}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.zip"
              onChange={handleFileChange}
              className="hidden"
              id={`resubmit-${assignment.id}`}
            />
            <label
              htmlFor={`resubmit-${assignment.id}`}
              className="text-xs text-neutral-400 underline cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              Zamijeni
            </label>
            {selectedFile && (
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
              >
                {isUploading ? "Šaljem..." : "Pošalji novi"}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.zip"
              onChange={handleFileChange}
              className="hidden"
              id={`submit-${assignment.id}`}
            />
            <label
              htmlFor={`submit-${assignment.id}`}
              className="flex items-center gap-2 text-sm cursor-pointer bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg transition-all"
            >
              <IconUpload className="h-4 w-4" />
              {selectedFile ? selectedFile.name : "Odaberi rješenje"}
            </label>
            {selectedFile && (
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className="flex items-center gap-2 text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Šaljem...
                  </>
                ) : (
                  <>
                    <IconUpload className="h-4 w-4" />
                    Predaj
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grade feedback */}
      {submission?.status === "GRADED" && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">
            Ocjena: {submission.pointsEarned} / {assignment.maxPoints} bodova
          </p>
          {submission.feedback && (
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              <span className="font-medium">Komentar: </span>
              {submission.feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function StudentAssignments() {
  const { studentMail } = useAuth();
  const { assignments, loading, uploadingId, submitAssignment, downloadProfessorFile } =
    useStudentAssignments(studentMail);

  const bySubject = assignments.reduce<Record<string, StudentAssignment[]>>(
    (acc, a) => {
      const key = a.subject.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(a);
      return acc;
    },
    {}
  );

  if (loading) {
    return (
      <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">
            Učitavanje zadaća...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900">
      <div className="flex flex-1 overflow-y-auto border-l border-neutral-200 dark:border-neutral-700">
        <div className="p-6 flex flex-col gap-6 flex-1 w-full min-h-full">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-semibold mb-1">Zadaće</h1>
            <p className="opacity-90 text-sm">
              Preuzmite materijale i predajte rješenja na jednom mjestu
            </p>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 border border-neutral-200 dark:border-neutral-700 text-center">
              <IconClipboardList className="h-16 w-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Nema zadaća
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                Trenutno nema zadaća za vaše predmete.
              </p>
            </div>
          ) : (
            Object.entries(bySubject).map(([subjectName, items]) => (
              <div key={subjectName}>
                <div className="flex items-center gap-2 mb-3">
                  <IconBook className="h-5 w-5 text-purple-500" />
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                    {subjectName}
                  </h2>
                  <span className="text-xs text-neutral-400">
                    ({items.length}{" "}
                    {items.length === 1 ? "zadaća" : "zadaće"})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((a) => (
                    <AssignmentCard
                      key={a.id}
                      assignment={a}
                      uploadingId={uploadingId}
                      onSubmit={submitAssignment}
                      onDownload={downloadProfessorFile}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
