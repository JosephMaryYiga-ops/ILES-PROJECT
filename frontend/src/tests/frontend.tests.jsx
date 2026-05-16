import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'
import StudentDashboard from '../pages/StudentDashboard'
import WeeklyLogs from '../pages/WeeklyLogs'
import SubmitLog from '../pages/SubmitLog'
import Criteria from '../pages/Criteria'
// Mock the api module so tests don't call the real backend
vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  }
}))

import api from '../api'

// ──────────────────────────────────────────
// TEST 1 — Login form renders correctly
// ──────────────────────────────────────────
describe('Test 1 — Login Page Renders', () => {
  it('shows username, password fields and login button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
})

 // ──────────────────────────────────────────
// TEST 2 — Login shows error on wrong credentials
// ──────────────────────────────────────────
describe('Test 2 — Login Error Message', () => {
  it('shows error message when login fails', async () => {
    api.post.mockRejectedValueOnce(new Error('Invalid credentials'))

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'wronguser' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpass' }
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument()
    })
  })
})

// 
// ──────────────────────────────────────────
// TEST 3 — Student Dashboard renders stats
// ──────────────────────────────────────────
describe('Test 3 — Student Dashboard Renders', () => {
  beforeEach(() => {
    localStorage.setItem('username', 'student1')
    localStorage.setItem('role', 'student')

    api.get.mockImplementation((url) => {
      if (url === '/placements/') return Promise.resolve({ data: [{ id: 1, company_name: 'MTN Uganda', supervisor_name: 'Mr. John', start_date: '2025-01-01', end_date: '2025-06-30' }] })
      if (url === '/logs/') return Promise.resolve({ data: [] })
      if (url === '/notifications/') return Promise.resolve({ data: [] })
      return Promise.resolve({ data: [] })
    })
  })
   it('shows welcome message with username', async () => {
    render(
      <MemoryRouter>
        <StudentDashboard />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/welcome back, student1/i)).toBeInTheDocument()
    })
  })
})
// ──────────────────────────────────────────
// TEST 4 — Weekly Logs shows empty state
// ──────────────────────────────────────────
describe('Test 4 — Weekly Logs Empty State', () => {
  beforeEach(() => {
    api.get.mockResolvedValueOnce({ data: [] })
  })

  it('shows empty message when no logs exist', async () => {
    render(
      <MemoryRouter>
        <WeeklyLogs />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/you have not submitted any logs yet/i)).toBeInTheDocument()
    })
  })
})
// ──────────────────────────────────────────
// TEST 5 — Submit Log form renders correctly
// ──────────────────────────────────────────
describe('Test 5 — Submit Log Form Renders', () => {
  beforeEach(() => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 1, company_name: 'MTN Uganda' }]
    })
  })
  it('shows week number, content fields and submit button', async () => {
    render(
      <MemoryRouter>
        <SubmitLog />
      </MemoryRouter>
    )
    //wait for the companies to load before checking for form fields
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/e.g. 1/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/describe your tasks/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit log/i })).toBeInTheDocument()
    })
  })
})
