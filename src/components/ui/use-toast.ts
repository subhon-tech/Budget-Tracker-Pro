'use client'

import { useEffect, useState } from 'react'
import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
    id: string
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
}

let count = 0
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER
    return count.toString()
}

type ActionType = { type: 'ADD_TOAST'; toast: ToasterToast } | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> } | { type: 'DISMISS_TOAST'; toastId?: string } | { type: 'REMOVE_TOAST'; toastId?: string }

const listeners: Array<(state: { toasts: ToasterToast[] }) => void> = []
let memoryState: { toasts: ToasterToast[] } = { toasts: [] }

function dispatch(action: ActionType) {
    switch (action.type) {
        case 'ADD_TOAST':
            memoryState = { toasts: [action.toast, ...memoryState.toasts].slice(0, TOAST_LIMIT) }
            break
        case 'UPDATE_TOAST':
            memoryState = { toasts: memoryState.toasts.map(t => t.id === action.toast.id ? { ...t, ...action.toast } : t) }
            break
        case 'DISMISS_TOAST':
            memoryState = { toasts: memoryState.toasts.map(t => (action.toastId == null || t.id === action.toastId) ? { ...t, open: false } : t) }
            break
        case 'REMOVE_TOAST':
            memoryState = { toasts: action.toastId == null ? [] : memoryState.toasts.filter(t => t.id !== action.toastId) }
            break
    }
    listeners.forEach(l => l(memoryState))
}

function toast({ ...props }: Omit<ToasterToast, 'id'>) {
    const id = genId()
    const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })
    dispatch({
        type: 'ADD_TOAST',
        toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) dismiss() } },
    })
    setTimeout(() => dismiss(), TOAST_REMOVE_DELAY)
    return { id, dismiss, update: (props: ToasterToast) => dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } }) }
}

function useToast() {
    const [state, setState] = useState(memoryState)
    useEffect(() => {
        listeners.push(setState)
        return () => { const i = listeners.indexOf(setState); if (i > -1) listeners.splice(i, 1) }
    }, [])
    return { ...state, toast, dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }) }
}

export { useToast, toast }
