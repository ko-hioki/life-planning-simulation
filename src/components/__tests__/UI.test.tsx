import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, Card, Alert, Input, Select } from '../ui/index'

describe('UI Components', () => {
  describe('Button', () => {
    it('基本的なボタンが正しくレンダリングされる', () => {
      render(<Button>テストボタン</Button>)
      expect(screen.getByRole('button', { name: 'テストボタン' })).toBeInTheDocument()
    })

    it('primaryバリアントが正しいクラスを持つ', () => {
      render(<Button variant="primary">Primary Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-smarthr-blue')
    })

    it('secondaryバリアントが正しいクラスを持つ', () => {
      render(<Button variant="secondary">Secondary Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-white', 'text-smarthr-black')
    })

    it('dangerバリアントが正しいクラスを持つ', () => {
      render(<Button variant="danger">Danger Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600')
    })

    it('disabledボタンが正しく動作する', () => {
      const mockClick = vi.fn()
      render(<Button disabled onClick={mockClick}>Disabled Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      
      fireEvent.click(button)
      expect(mockClick).not.toHaveBeenCalled()
    })

    it('ボタンクリックイベントが正常に発火する', async () => {
      const mockClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={mockClick}>Clickable Button</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockClick).toHaveBeenCalledTimes(1)
    })

    it('サイズバリアントが正しく適用される', () => {
      const { rerender } = render(<Button size="sm">Small Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm')
      
      rerender(<Button size="lg">Large Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-base')
    })
  })

  describe('Card', () => {
    it('カードが正しくレンダリングされる', () => {
      render(<Card>カードコンテンツ</Card>)
      expect(screen.getByText('カードコンテンツ')).toBeInTheDocument()
    })

    it('カードに正しいクラスが適用される', () => {
      render(<Card className="custom-class">カードコンテンツ</Card>)
      const card = screen.getByText('カードコンテンツ').closest('div')
      expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'custom-class')
    })

    it('clickableカードがクリックイベントを処理する', async () => {
      const mockClick = vi.fn()
      const user = userEvent.setup()
      
      render(<Card onClick={mockClick}>クリッカブルカード</Card>)
      
      const card = screen.getByText('クリッカブルカード').closest('div')
      await user.click(card!)
      
      expect(mockClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Alert', () => {
    it('infoアラートが正しくレンダリングされる', () => {
      render(<Alert variant="info">情報メッセージ</Alert>)
      expect(screen.getByText('情報メッセージ')).toBeInTheDocument()
    })

    it('successアラートが正しいクラスを持つ', () => {
      render(<Alert variant="success">成功メッセージ</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800')
    })

    it('warningアラートが正しいクラスを持つ', () => {
      render(<Alert variant="warning">警告メッセージ</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-800')
    })

    it('errorアラートが正しいクラスを持つ', () => {
      render(<Alert variant="error">エラーメッセージ</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800')
    })

    it('閉じるボタンがあるアラートが正常に動作する', async () => {
      const mockClose = vi.fn()
      const user = userEvent.setup()
      
      render(
        <Alert variant="info" onClose={mockClose}>
          閉じられるアラート
        </Alert>
      )
      
      const closeButton = screen.getByRole('button', { name: /閉じる/ })
      await user.click(closeButton)
      
      expect(mockClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Input', () => {
    it('基本的な入力フィールドが正しくレンダリングされる', () => {
      render(<Input placeholder="テスト入力" />)
      expect(screen.getByPlaceholderText('テスト入力')).toBeInTheDocument()
    })

    it('ラベル付き入力フィールドが正しくレンダリングされる', () => {
      render(<Input label="テストラベル" id="test-input" />)
      expect(screen.getByLabelText('テストラベル')).toBeInTheDocument()
    })

    it('エラー状態の入力フィールドが正しいクラスを持つ', () => {
      render(<Input error="エラーメッセージ" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('form-input-error')
      expect(screen.getByText('エラーメッセージ')).toBeInTheDocument()
    })

    it('入力値の変更が正常に動作する', async () => {
      const mockChange = vi.fn()
      const user = userEvent.setup()
      
      render(<Input onChange={mockChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'テスト入力値')
      
      expect(mockChange).toHaveBeenCalled()
    })

    it('必須フィールドのマークが表示される', () => {
      render(<Input label="必須フィールド" required />)
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('ヘルプテキストが表示される', () => {
      render(<Input label="テスト" helpText="これはヘルプテキストです" />)
      expect(screen.getByText('これはヘルプテキストです')).toBeInTheDocument()
    })
  })

  describe('Select', () => {
    const options = [
      { value: '1', label: 'オプション1' },
      { value: '2', label: 'オプション2' },
      { value: '3', label: 'オプション3' },
    ]

    it('基本的なセレクトボックスが正しくレンダリングされる', () => {
      render(<Select options={options} />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('ラベル付きセレクトボックスが正しくレンダリングされる', () => {
      render(<Select label="テストセレクト" options={options} id="test-select" />)
      expect(screen.getByLabelText('テストセレクト')).toBeInTheDocument()
    })

    it('オプションが正しく表示される', () => {
      render(<Select options={options} />)
      
      options.forEach(option => {
        expect(screen.getByRole('option', { name: option.label })).toBeInTheDocument()
      })
    })

    it('値の選択が正常に動作する', async () => {
      const mockChange = vi.fn()
      const user = userEvent.setup()
      
      render(<Select options={options} onChange={mockChange} />)
      
      const select = screen.getByRole('combobox')
      await user.selectOptions(select, '2')
      
      expect(mockChange).toHaveBeenCalledWith(
        expect.objectContaining({ target: expect.objectContaining({ value: '2' }) })
      )
    })

    it('エラー状態のセレクトボックスが正しいクラスを持つ', () => {
      render(<Select options={options} error="エラーメッセージ" />)
      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('form-input-error')
      expect(screen.getByText('エラーメッセージ')).toBeInTheDocument()
    })

    it('プレースホルダーが正しく表示される', () => {
      render(<Select options={options} placeholder="選択してください" />)
      expect(screen.getByText('選択してください')).toBeInTheDocument()
    })
  })
})
