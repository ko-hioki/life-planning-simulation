/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SmartHR公式カラーパレット (正確な色とネーミング)
        // Primary Brand Color
        'smarthr-blue': '#00c4cc',
        
        // Secondary Brand Colors
        'smarthr-black': '#23221f',
        'smarthr-orange': '#ff9900',
        'smarthr-white': '#ffffff',
        
        // Extended Colors - Stone (SmartHR公式の01-04ネーミングに合わせる)
        stone: {
          '01': '#f8f7f6',
          '02': '#edebe6',
          '03': '#aaa69f',
          '04': '#4e4c49',
          50: '#f8f7f6',  // 既存コードとの互換性用
          100: '#edebe6',
          200: '#aaa69f',
          300: '#4e4c49',
          400: '#23221f'
        },
        
        // Extended Colors - Aqua
        aqua: {
          '01': '#d4f4f5',
          '02': '#69d9de',
          '03': '#12abb1',
          '04': '#0f7f85',
          50: '#d4f4f5',
          100: '#69d9de',
          200: '#12abb1',
          300: '#0f7f85'
        },
        
        // Extended Colors - Sakura
        sakura: {
          '01': '#f9e9f7',
          '02': '#f8b2e1',
          '03': '#d362af',
          '04': '#82407c',
          50: '#f9e9f7',
          100: '#f8b2e1',
          200: '#d362af',
          300: '#82407c'
        },
        
        // Extended Colors - Momiji (Red)
        momiji: {
          '01': '#ffe7e5',
          '02': '#ff9e9c',
          '03': '#ec5a55',
          '04': '#a53f3f',
          50: '#ffe7e5',
          100: '#ff9e9c',
          200: '#ec5a55',
          300: '#a53f3f'
        },
        
        // Extended Colors - Sunlight (Yellow)
        sunlight: {
          '01': '#faf2d0',
          '02': '#ffee11',
          '03': '#ffd74a',
          '04': '#f56121',
          50: '#faf2d0',
          100: '#ffee11',
          200: '#ffd74a',
          300: '#f56121'
        },
        
        // Extended Colors - Grass (Green)
        grass: {
          '01': '#e6f2c8',
          '02': '#aee26b',
          '03': '#3dcc65',
          '04': '#378445',
          50: '#e6f2c8',
          100: '#aee26b',
          200: '#3dcc65',
          300: '#378445'
        },
        
        // Extended Colors - Sky (Light Blue)
        sky: {
          '01': '#ddf2fb',
          '02': '#8fe2fc',
          '03': '#32b7f0',
          '04': '#1376a0',
          50: '#ddf2fb',
          100: '#8fe2fc',
          200: '#32b7f0',
          300: '#1376a0'
        },
        
        // Extended Colors - Marine (Blue)
        marine: {
          '01': '#dee9ff',
          '02': '#8ac0ff',
          '03': '#0075e3',
          '04': '#26519f',
          50: '#dee9ff',
          100: '#8ac0ff',
          200: '#0075e3',
          300: '#26519f'
        },
        
        // Extended Colors - Galaxy (Purple)
        galaxy: {
          '01': '#eee5fd',
          '02': '#9d8ef8',
          '03': '#8c5eee',
          '04': '#6e4ca6',
          50: '#eee5fd',
          100: '#9d8ef8',
          200: '#8c5eee',
          300: '#6e4ca6'
        },
        
        // Extended Colors - Earth (Brown)
        earth: {
          '01': '#fbede1',
          '02': '#f2d3a4',
          '03': '#ba621e',
          '04': '#76533e',
          50: '#fbede1',
          100: '#f2d3a4',
          200: '#ba621e',
          300: '#76533e'
        },
        
        // Semantic colors mapping to SmartHR colors
        primary: {
          50: '#d4f4f5',
          100: '#69d9de',
          200: '#12abb1',
          300: '#0f7f85',
          400: '#0d676b',
          500: '#00c4cc', // SmartHR Blue
          600: '#00a0a7',
          700: '#007c82',
          800: '#00585d',
          900: '#003438'
        },
        
        gray: {
          50: '#f8f7f6',
          100: '#edebe6',
          200: '#d6d3cc',
          300: '#aaa69f',
          400: '#7a766e',
          500: '#4e4c49',
          600: '#3d3b38',
          700: '#2c2a28',
          800: '#23221f', // SmartHR Black
          900: '#1a1918'
        },
        
        // Success, warning, error states using SmartHR Extended Colors
        success: {
          50: '#e6f2c8',
          100: '#aee26b', 
          500: '#3dcc65',
          600: '#378445'
        },
        
        warning: {
          50: '#faf2d0',
          100: '#ffd74a',
          500: '#ff9900', // SmartHR Orange
          600: '#f56121'
        },
        
        error: {
          50: '#ffe7e5',
          100: '#ff9e9c',
          500: '#ec5a55',
          600: '#a53f3f'
        }
      },
      fontFamily: {
        // SmartHRでよく使われる日本語フォントスタック
        sans: [
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'Yu Gothic UI',
          'Meiryo',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ]
      },
      fontSize: {
        // SmartHR風のタイポグラフィスケール
        'xs': ['0.75rem', '1.125rem'],
        'sm': ['0.875rem', '1.375rem'],
        'base': ['1rem', '1.5rem'],
        'lg': ['1.125rem', '1.75rem'],
        'xl': ['1.25rem', '1.875rem'],
        '2xl': ['1.5rem', '2.25rem'],
        '3xl': ['1.875rem', '2.25rem'],
        '4xl': ['2.25rem', '2.5rem']
      },
      spacing: {
        // SmartHR風のスペーシングシステム（8px基準）
        '0.5': '0.125rem', // 2px
        '1.5': '0.375rem', // 6px
        '2.5': '0.625rem', // 10px
        '3.5': '0.875rem', // 14px
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
        '6.5': '1.625rem', // 26px
        '7.5': '1.875rem', // 30px
        '18': '4.5rem',    // 72px
        '22': '5.5rem',    // 88px
        '88': '22rem'      // 352px
      },
      borderRadius: {
        // SmartHR風の角丸（統一感のある値）
        'none': '0',
        'sm': '0.25rem',   // 4px
        'DEFAULT': '0.375rem', // 6px
        'md': '0.5rem',    // 8px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
        '2xl': '1.5rem',   // 24px
        'full': '9999px'
      },
      boxShadow: {
        // SmartHR風のシャドウ（控えめで上品）
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'button': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'button-hover': '0 2px 4px rgba(0, 0, 0, 0.15)',
        'form': '0 0 0 1px rgba(0, 196, 204, 0.3)'
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 1.5s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      }
    },
  },
  plugins: [],
}
