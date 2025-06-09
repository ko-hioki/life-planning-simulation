import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BasicInfoForm } from '../forms/BasicInfoForm'
import type { UserInfo } from '../../types'
import React, { useState } from 'react'

// Mock the hooks
vi.mock('../../hooks', () => ({
  useFormValidation: () => ({
    errors: {},
    isValid: true,
    validate: vi.fn(() => true),
  }),
}))

// テスト用ラッパーコンポーネント
const BasicInfoFormWrapper: React.FC<{
  onUpdate?: (data: Partial<UserInfo>) => void
  onNext?: () => void
  onCancel?: () => void
}> = ({ onUpdate, onNext, onCancel }) => {
  const [data, setData] = useState<Partial<UserInfo>>({})
  
  const handleUpdate = (newData: Partial<UserInfo>) => {
    setData(newData)
    onUpdate?.(newData)
  }
  
  return (
    <BasicInfoForm
      data={data}
      onUpdate={handleUpdate}
      onNext={onNext || (() => {})}
      onCancel={onCancel || (() => {})}
    />
  )
}

describe('BasicInfoForm', () => {
  const mockOnUpdate = vi.fn()
  const mockOnNext = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基本情報フォームが正しくレンダリングされる', () => {
    render(<BasicInfoFormWrapper onUpdate={mockOnUpdate} onNext={mockOnNext} onCancel={mockOnCancel} />)

    // フォームのタイトルが表示されることを確認
    expect(screen.getByText('基本情報の入力')).toBeInTheDocument()
    
    // 説明文が表示されることを確認
    expect(screen.getByText(/まずは、あなたとご家族の基本的な情報を教えてください/)).toBeInTheDocument()

    // 必須フィールドが表示されることを確認
    expect(screen.getByLabelText(/お名前/)).toBeInTheDocument()
    expect(screen.getByLabelText(/生年/)).toBeInTheDocument()
    expect(screen.getByLabelText(/退職予定年齢/)).toBeInTheDocument()
  })

  it('名前入力フィールドが正常に動作する', async () => {
    const user = userEvent.setup()
    render(<BasicInfoFormWrapper onUpdate={mockOnUpdate} onNext={mockOnNext} onCancel={mockOnCancel} />)

    const nameInput = screen.getByLabelText(/お名前/)
    await user.clear(nameInput)
    await user.type(nameInput, '山田太郎')

    await waitFor(() => {
      // 入力フィールドの値が正しく設定されているかチェック
      expect(nameInput).toHaveValue('山田太郎')
    })

    // onUpdateが最後の文字で呼ばれることを確認
    expect(mockOnUpdate).toHaveBeenCalled()
  })

  it('生年選択が正常に動作する', async () => {
    const user = userEvent.setup()
    render(<BasicInfoFormWrapper onUpdate={mockOnUpdate} onNext={mockOnNext} onCancel={mockOnCancel} />)

    const birthYearSelect = screen.getByLabelText(/生年/)
    await user.selectOptions(birthYearSelect, '1990')

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ birthYear: 1990 })
      )
    })
  })

  it('配偶者の有無が正常に動作する', async () => {
    const user = userEvent.setup()
    render(<BasicInfoFormWrapper onUpdate={mockOnUpdate} onNext={mockOnNext} onCancel={mockOnCancel} />)

    // 「配偶者がいる」ラジオボタンを選択
    const hasSpouseYes = screen.getByLabelText('はい')
    await user.click(hasSpouseYes)

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ hasSpouse: true })
      )
    })
  })

  it('配偶者がいる場合、配偶者の情報入力フィールドが表示される', async () => {
    const user = userEvent.setup()
    
    // 配偶者がいる状態のラッパーコンポーネント
    const BasicInfoFormWrapperWithSpouse: React.FC = () => {
      const [data, setData] = useState<Partial<UserInfo>>({ hasSpouse: true })
      
      const handleUpdate = (newData: Partial<UserInfo>) => {
        setData(newData)
        mockOnUpdate(newData)
      }
      
      return (
        <BasicInfoForm
          data={data}
          onUpdate={handleUpdate}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      )
    }
    
    render(<BasicInfoFormWrapperWithSpouse />)

    // 配偶者の情報セクションが表示されることを確認
    expect(screen.getByText('配偶者の情報')).toBeInTheDocument()
    expect(screen.getByLabelText(/配偶者の生年/)).toBeInTheDocument()
  })

  it('フォーム送信が正常に動作する', async () => {
    const user = userEvent.setup()
    const validData: Partial<UserInfo> = {
      name: '山田太郎',
      birthYear: 1990,
      retirementAge: 65,
      hasSpouse: false,
    }

    // 有効なデータを持つラッパーコンポーネント
    const BasicInfoFormWrapperWithValidData: React.FC = () => {
      const [data, setData] = useState<Partial<UserInfo>>(validData)
      
      const handleUpdate = (newData: Partial<UserInfo>) => {
        setData(newData)
        mockOnUpdate(newData)
      }
      
      return (
        <BasicInfoForm
          data={data}
          onUpdate={handleUpdate}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      )
    }

    render(<BasicInfoFormWrapperWithValidData />)

    const nextButton = screen.getByText('次へ')
    await user.click(nextButton)

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledTimes(1)
    })
  })

  it('キャンセルボタンが正常に動作する', async () => {
    const user = userEvent.setup()
    render(<BasicInfoFormWrapper onUpdate={mockOnUpdate} onNext={mockOnNext} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByText('キャンセル')
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('退職年齢の選択肢が正しく表示される', () => {
    render(<BasicInfoFormWrapper onUpdate={mockOnUpdate} onNext={mockOnNext} onCancel={mockOnCancel} />)

    const retirementAgeSelect = screen.getByLabelText(/退職予定年齢/)
    
    // 50歳から94歳までのオプションが含まれていることを確認
    expect(retirementAgeSelect).toBeInTheDocument()
    const options = screen.getAllByRole('option')
    
    // 最初のオプションは「選択してください」なので、年齢オプションは45個 + 1個
    expect(options.length).toBeGreaterThan(45)
  })

  it('現在の貯蓄額入力が正常に動作する', async () => {
    const user = userEvent.setup()
    render(<BasicInfoFormWrapper onUpdate={mockOnUpdate} onNext={mockOnNext} onCancel={mockOnCancel} />)

    const savingsInput = screen.getByLabelText(/現在の貯蓄額/)
    await user.clear(savingsInput)
    await user.type(savingsInput, '5000000')

    await waitFor(() => {
      // 最後の呼び出しで正しい値が含まれているかチェック
      const calls = mockOnUpdate.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall).toBeDefined()
      expect(lastCall[0].currentSavings).toBe(5000000)
    })
  })

  it('アクセシビリティ属性が正しく設定されている', () => {
    render(<BasicInfoFormWrapper onUpdate={mockOnUpdate} onNext={mockOnNext} onCancel={mockOnCancel} />)

    // フォーム要素にproper labelsが設定されていることを確認
    expect(screen.getByLabelText(/お名前/)).toBeInTheDocument()
    expect(screen.getByLabelText(/生年/)).toBeInTheDocument()
    expect(screen.getByLabelText(/退職予定年齢/)).toBeInTheDocument()

    // ヘルプテキストがaria-describedbyで関連付けられていることを確認
    const nameInput = screen.getByLabelText(/お名前/)
    expect(nameInput).toHaveAttribute('aria-describedby', 'name-help')
  })

  it('バリデーションエラーが正しく表示される', async () => {
    const user = userEvent.setup()
    render(<BasicInfoFormWrapper onUpdate={mockOnUpdate} onNext={mockOnNext} onCancel={mockOnCancel} />)

    // フォーム送信ボタンをクリックしてバリデーションを実行
    const submitButton = screen.getByText('次へ')
    await user.click(submitButton)

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getAllByText('名前は必須項目です')).toHaveLength(1)
    })
    
    // エラーがあるフィールドにerror classが適用されることを確認
    const nameInput = screen.getByLabelText(/お名前/)
    expect(nameInput).toHaveClass('form-input-error')
  })
})
