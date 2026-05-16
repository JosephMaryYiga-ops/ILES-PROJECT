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

// 