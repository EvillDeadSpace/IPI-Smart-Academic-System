import { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../config'
import { STORAGE_KEYS } from '../../constants/storage'
import { Lecture } from '../../types/LectureTypes/lecture'

export function useLecturesByStudent() {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLectures() {
      try {
        const email = localStorage.getItem(STORAGE_KEYS.STUDENT_EMAIL)
        if (!email) {
          setError('No email found. Please login again.')
          setLoading(false)
          return
        }

        const response = await fetch(`${BACKEND_URL}/api/lecture/student/${email}`)

        if (!response.ok) {
          setError(`Failed to fetch lectures: ${response.status}`)
          setLoading(false)
          return
        }

        const data: Lecture[] = await response.json()
        setLectures(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lectures')
      } finally {
        setLoading(false)
      }
    }

    fetchLectures()
  }, [])

  return { lectures, loading, error }
}

export function useAllLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/lecture`)
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`)
      const data: Lecture[] = await response.json()
      setLectures(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lectures')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return { lectures, loading, error, refetch: fetchAll }
}
