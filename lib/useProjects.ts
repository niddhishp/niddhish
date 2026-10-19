'use client'

import { useEffect, useState } from 'react'
import { loadProjects, type Project } from './projects'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    loadProjects(controller.signal)
      .then(data => { if (!controller.signal.aborted) setProjects(data) })
      .catch(() => { if (!controller.signal.aborted) setError(true) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  return { projects, loading, error }
}
