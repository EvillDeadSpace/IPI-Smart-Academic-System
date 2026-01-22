import { IconBook, IconClipboardList, IconFileText } from '@tabler/icons-react'
import { FC, useEffect, useState } from 'react'
import { BACKEND_URL, NLP_URL } from '../../config'
import { useAuth } from '../../Context'
import { toastError, toastSuccess } from '../../lib/toast'
interface Subject {
    id: number
    name: string
    code: string
}

interface Homework {
    id: number
    title: string
    description: string
    subjectId: number
    dueDate: string
    status: 'pending' | 'submitted' | 'late'
    maxPoints: number
    earnedPoints?: number
}

// Definiši tip za S3 fajlove (string array)
type S3File = string

interface SubjectEnrollment {
    subject: {
        id: number
        name: string
        code: string
    }
}

const Homework: FC = () => {
    const { studentMail } = useAuth()
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [files, setFiles] = useState<S3File[]>([])
    const [loading, setLoading] = useState(true)
    const [filesLoading, setFilesLoading] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            if (!studentMail) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const response = await fetch(
                    `${BACKEND_URL}/api/students/email/${studentMail}`
                )

                if (response.ok) {
                    const responseData = await response.json()
                    console.log('📦 Raw response:', responseData)

                    const studentData = responseData.data || responseData
                    console.log('👤 Student data:', studentData)
                    console.log(
                        '📚 Subject enrollments:',
                        studentData.subjectEnrollments
                    )

                    if (
                        studentData.subjectEnrollments &&
                        studentData.subjectEnrollments.length > 0
                    ) {
                        const enrolledSubjects =
                            studentData.subjectEnrollments.map(
                                (enrollment: SubjectEnrollment) => {
                                    console.log('📖 Enrollment:', enrollment)
                                    return {
                                        id: enrollment.subject.id,
                                        name: enrollment.subject.name,
                                        code: enrollment.subject.code,
                                    }
                                }
                            )
                        console.log('✅ Enrolled subjects:', enrolledSubjects)
                        setSubjects(enrolledSubjects)
                        toastSuccess(
                            `Učitano ${enrolledSubjects.length} predmeta!`
                        )
                    } else {
                        console.warn(
                            '⚠️ Nema upisanih predmeta za ovog studenta'
                        )
                        setSubjects([])
                        toastError('Ne pohađate nijedan predmet trenutno.')
                    }
                } else {
                    const errorText = await response.text()
                    console.error(
                        '❌ Response error:',
                        response.status,
                        errorText
                    )
                    toastError('Greška pri učitavanju predmeta.')
                }
            } catch (error) {
                console.error('Error fetching subjects:', error)
                toastError('Greška pri učitavanju podataka.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [studentMail])

    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
        null
    )

    useEffect(() => {
        if (!selectedSubjectId) {
            setFiles([])
            return
        }

        const selectedSubject = subjects.find((s) => s.id === selectedSubjectId)
        console.log('📌 Izabrani predmet:', selectedSubject?.name)

        async function fetchHomeworks() {
            setFilesLoading(true)
            setFiles([]) // Clear previous files
            try {
                const response = await fetch(`${NLP_URL}/get_all_file_s3`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subject: selectedSubject?.name,
                    }),
                })
                console.log(response)
                if (!response.ok) {
                    throw new Error('Fetch failed')
                }

                const data = await response.json()
                console.log('📦 Raw homeworks response:', data)

                const fileList = data.professor_subject || []
                setFiles(fileList)
            } catch (err) {
                console.error('❌ Error fetching homeworks:', err)
                setFiles([])
            } finally {
                setFilesLoading(false)
            }
        }

        fetchHomeworks()
    }, [selectedSubjectId, subjects])

    // Download file handler
    const handleDownload = async (filePath: string) => {
        try {
            const [folderName, fileName] = filePath.split('/')
            const response = await fetch(
                `${NLP_URL}/get_file_from_s3?folder_name=${encodeURIComponent(
                    folderName
                )}&file_name=${encodeURIComponent(fileName)}`
            )

            if (!response.ok) {
                throw new Error('Download failed')
            }

            // Create blob and download
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toastSuccess(`Preuzeto: ${fileName}`)
        } catch (err) {
            console.error('❌ Download error:', err)
            toastError('Greška pri preuzimanju fajla')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Učitavanje predmeta...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900">
            <div className="flex flex-1 overflow-y-auto border-l border-neutral-200 dark:border-neutral-700">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full overflow-y-auto">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <h1 className="text-2xl font-semibold mb-2">
                            Zadaće i Domaći
                        </h1>
                        <p className="opacity-90">
                            Pratite sve svoje zadaće i rokove na jednom mjestu
                        </p>
                    </div>

                    {/* Ako nema predmeta, prikaži poruku */}
                    {subjects.length === 0 ? (
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 border border-neutral-200 dark:border-neutral-700 text-center">
                            <IconBook className="h-16 w-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                Nema upisanih predmeta
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Trenutno niste upisani na nijedan predmet.
                                Kontaktirajte administraciju.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Subject Selector */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                                    Izaberite predmet
                                </label>
                                <select
                                    value={selectedSubjectId || ''}
                                    onChange={(e) =>
                                        setSelectedSubjectId(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                    className="w-full px-4 py-3 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                >
                                    <option value="">
                                        -- Izaberite predmet --
                                    </option>
                                    {subjects.map((subject) => (
                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.code} - {subject.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* File List */}
                            {selectedSubjectId ? (
                                filesLoading ? (
                                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 border border-neutral-200 dark:border-neutral-700 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                                                    Učitavanje materijala...
                                                </h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    Molimo sačekajte
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : files.length > 0 ? (
                                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                                                    Dostupni materijali
                                                </h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                    {files.length}{' '}
                                                    {files.length === 1
                                                        ? 'fajl'
                                                        : 'fajlova'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {files.map((filePath, index) => {
                                                const fileName =
                                                    filePath.split('/')[1] ||
                                                    filePath
                                                const fileExtension =
                                                    fileName
                                                        .split('.')
                                                        .pop()
                                                        ?.toLowerCase() || ''

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            handleDownload(
                                                                filePath
                                                            )
                                                        }
                                                        className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 p-5 rounded-xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 hover:shadow-lg hover:scale-105 text-left"
                                                    >
                                                        <div className="flex flex-col gap-3">
                                                            <div className="flex items-start justify-between">
                                                                <div className="bg-purple-600 dark:bg-purple-500 p-3 rounded-lg group-hover:bg-purple-700 transition-colors">
                                                                    <IconFileText className="h-6 w-6 text-white" />
                                                                </div>
                                                                {fileExtension && (
                                                                    <span className="px-2 py-1 bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 text-xs font-semibold rounded uppercase">
                                                                        {
                                                                            fileExtension
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-neutral-900 dark:text-white font-semibold text-sm line-clamp-2 mb-1">
                                                                    {fileName}
                                                                </h4>
                                                                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                                                    Klikni za
                                                                    preuzimanje
                                                                    →
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/5 rounded-xl transition-colors pointer-events-none" />
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 border border-neutral-200 dark:border-neutral-700 text-center">
                                        <IconBook className="h-16 w-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                            Nema fajlova
                                        </h3>
                                        <p className="text-neutral-600 dark:text-neutral-400">
                                            Trenutno nema dostupnih materijala
                                            za izabrani predmet.
                                        </p>
                                    </div>
                                )
                            ) : (
                                <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 border border-neutral-200 dark:border-neutral-700 text-center">
                                    <IconClipboardList className="h-16 w-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                        Izaberite predmet
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        Izaberite predmet iz padajuće liste da
                                        biste vidjeli dostupne materijale.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Homework
