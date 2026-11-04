import { useCallback, useEffect, useState } from 'react'

/**
 * Run an async function when `deps` change and track its state.
 *
 *   const { data, error, isLoading, reload } = useAsync(() => getComic(id), [id])
 *
 * While reloading, the previous `data` is kept so lists don't flash empty.
 * Stale responses (from an older request) are ignored.
 */
export function useAsync(load, deps) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false
    setState((previous) => (previous.status === 'loading' ? previous : { ...previous, status: 'loading' }))

    load().then(
      (data) => {
        if (!ignore) setState({ status: 'success', data, error: null })
      },
      (error) => {
        if (!ignore) setState({ status: 'error', data: null, error })
      },
    )

    return () => {
      ignore = true
    }
    // `load` is recreated on every render; `deps` is what decides when to re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const reload = useCallback(() => setAttempt((count) => count + 1), [])

  return {
    data: state.data,
    error: state.error,
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    reload,
  }
}
