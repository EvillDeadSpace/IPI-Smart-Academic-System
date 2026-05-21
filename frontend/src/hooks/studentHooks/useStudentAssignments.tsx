import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL, NLP_URL } from "../../config";
import { toastError, toastSuccess } from "../../lib/toast";

export type StudentAssignment = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  difficulty: string;
  dueDate: string;
  maxPoints: number;
  professorS3Path: string | null;
  subject: { id: number; name: string; code: string };
  submission: {
    id: number;
    s3Path: string | null;
    pointsEarned: number;
    feedback: string | null;
    status: "PENDING" | "GRADED";
    submittedAt: string | null;
    gradedAt: string | null;
  } | null;
};

export default function useStudentAssignments(studentEmail: string) {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const fetchAssignments = useCallback(async () => {
    if (!studentEmail) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/assignments/student/${studentEmail}`
      );
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch {
      toastError("Greška pri učitavanju zadaća");
    } finally {
      setLoading(false);
    }
  }, [studentEmail]);

  const submitAssignment = useCallback(
    async (assignment: StudentAssignment, file: File) => {
      setUploadingId(assignment.id);
      try {
        const formData = new FormData();
        formData.append("professor_subject", `assignments_${assignment.id}`);
        formData.append("assignment", studentEmail);
        formData.append("file", file);

        const uploadRes = await fetch(`${NLP_URL}/save_s3`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload na S3 nije uspio");

        const ext = file.name.split(".").pop() || "pdf";
        const s3Path = `assignments_${assignment.id}/${studentEmail}.${ext}`;

        const submitRes = await fetch(
          `${BACKEND_URL}/api/assignments/${assignment.id}/submit`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentEmail, s3Path }),
          }
        );

        if (!submitRes.ok) throw new Error("Greška pri predaji zadaće");

        toastSuccess(`Zadaća "${assignment.title}" uspješno predana!`);
        await fetchAssignments();
      } catch (error) {
        toastError(
          error instanceof Error ? error.message : "Greška pri predaji"
        );
      } finally {
        setUploadingId(null);
      }
    },
    [studentEmail, fetchAssignments]
  );

  const downloadProfessorFile = useCallback(async (s3Path: string) => {
    try {
      const [folderName, fileName] = s3Path.split("/");
      const response = await fetch(
        `${NLP_URL}/get_file_from_s3?folder_name=${encodeURIComponent(folderName)}&file_name=${encodeURIComponent(fileName)}`
      );
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toastSuccess(`Preuzeto: ${fileName}`);
    } catch {
      toastError("Greška pri preuzimanju fajla");
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return {
    assignments,
    loading,
    uploadingId,
    fetchAssignments,
    submitAssignment,
    downloadProfessorFile,
  };
}
