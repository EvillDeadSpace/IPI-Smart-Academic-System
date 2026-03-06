import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { BACKEND_URL } from '../../config'
import { toastError } from '../../lib/toast'
import { Comment } from '../../types/NewsTypes/NewsTypes'

export default function useNewsHooks() {
    const [loadingComments, setLoadingComments] = useState(false)
    const [comments, setComments] = useState<Comment[]>([])

    const fetchNewsQuery = async () => {
        const response = await fetch(`${BACKEND_URL}/api/news`)

        if (!response.ok) {
            toastError('Greska pri dohvacanju vjesti.')
        }

        return await response.json()
    }

    const { data, isLoading } = useQuery({
        queryKey: ['newsItems'],
        queryFn: fetchNewsQuery,
    })

    const fetchComments = useCallback(async (newsId: number) => {
        setLoadingComments(true)
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/news/${newsId}/comments`
            )
            const data = await response.json()
            setComments(data)
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoadingComments(false)
        }
    }, [])

    const addComment = useCallback(
        async (newsId: number, content: string, email: string) => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/news/${newsId}/comments`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content, email }),
                    }
                )

                if (!response.ok) {
                    const err = await response.json()
                    throw new Error(err.error || 'Greška prilikom dodavanja')
                }

                const created = await response.json()
                setComments((prev) => [created, ...prev])
                return created
            } catch (error) {
                console.error('addComment error:', error)
                throw error
            }
        },
        []
    )

    const deleteComment = useCallback(
        async (commentId: string, email: string) => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/news/comments/${commentId}`,
                    {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                    }
                )

                if (!response.ok) {
                    const err = await response.json()
                    throw new Error(err.error || 'Greška prilikom brisanja')
                }

                setComments((prev) => prev.filter((c) => c.id !== commentId))
                return true
            } catch (error) {
                console.error('deleteComment error:', error)
                throw error
            }
        },
        []
    )

    return {
        loadingComments,
        comments,
        fetchComments,
        addComment,
        deleteComment,
        setComments,
        data,
        isLoading,
    }
}
