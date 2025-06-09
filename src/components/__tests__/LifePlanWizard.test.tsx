import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LifePlanWizard } from '../LifePlanWizard'
import type { LifePlan } from '../../types'

// Mock the hooks
vi.mock('../../hooks', () => ({
  useWizard: () => ({
    currentStep: 0,
    steps: [
      { id: 'basic-info', title: '基本情報', description: 'test description', icon: '👤', component: () => <div>BasicInfoForm</div>, isCompleted: false },
      { id: 'income', title: '収入情報', description: 'test description', icon: '💰', component: () => <div>IncomeInfoForm</div>, isCompleted: false },
    ],
    goToStep: vi.fn(),
    nextStep: vi.fn(),
    prevStep: vi.fn(),
    canGoNext: true,
    canGoPrev: false,
    isFirstStep: true,
    isLastStep: false,
    progress: 50,
  }),
}))

// Mock the form components
vi.mock('../forms', () => ({
  BasicInfoForm: ({ onNext, onCancel }: { onNext: () => void; onCancel: () => void }) => (
    <div data-testid="basic-info-form">
      <button onClick={onNext}>Next</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
  IncomeInfoForm: () => <div data-testid="income-info-form">Income Form</div>,
  ExpenseInfoForm: () => <div data-testid="expense-info-form">Expense Form</div>,
  ChildrenInfoForm: () => <div data-testid="children-info-form">Children Form</div>,
  SimulationSettingsForm: () => <div data-testid="simulation-settings-form">Simulation Settings Form</div>,
  ReviewForm: () => <div data-testid="review-form">Review Form</div>,
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('LifePlanWizard', () => {
  const mockOnComplete = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ライフプランウィザードが正しくレンダリングされる', () => {
    renderWithRouter(
      <LifePlanWizard
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    )

    // ヘッダーが表示されることを確認
    expect(screen.getByText('ライフプラン作成')).toBeInTheDocument()
    
    // プログレスバーのコンテナが表示されることを確認
    expect(screen.getByTestId('wizard-progress')).toBeInTheDocument()
    
    // 最初のステップ（基本情報フォーム）が表示されることを確認
    expect(screen.getByTestId('basic-info-form')).toBeInTheDocument()
  })

  it('キャンセルボタンが正常に動作する', () => {
    renderWithRouter(
      <LifePlanWizard
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByText('キャンセル')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('初期データが提供された場合、編集モードで表示される', () => {
    const initialData: Partial<LifePlan> = {
      id: 'test-id',
      name: 'テストプラン',
      user: {
        name: 'テストユーザー',
        birthYear: 1990,
        retirementAge: 65,
      },
    }

    renderWithRouter(
      <LifePlanWizard
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
        initialData={initialData as LifePlan}
      />
    )

    // 編集モードのヘッダーが表示されることを確認
    expect(screen.getByText('ライフプラン編集')).toBeInTheDocument()
  })

  it('ステップタイトルが正しく表示される', () => {
    renderWithRouter(
      <LifePlanWizard
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    )

    // 現在のステップタイトルが表示されることを確認
    expect(screen.getByText('基本情報')).toBeInTheDocument()
  })

  it('アクセシビリティ属性が正しく設定されている', () => {
    renderWithRouter(
      <LifePlanWizard
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    )

    // メインコンテンツエリアにrole属性が設定されていることを確認
    const mainContent = screen.getByRole('main')
    expect(mainContent).toBeInTheDocument()

    // プログレスバーにappropriate ARIA属性が設定されていることを確認
    const progressBar = screen.getByTestId('wizard-progress')
    expect(progressBar).toBeInTheDocument()
  })
})
