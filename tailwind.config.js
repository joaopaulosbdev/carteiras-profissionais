/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leather: {
          950: '#100804',
          900: '#180C07',
          850: '#22110A',
          800: '#2C170E',
          700: '#3D2114',
          600: '#522E1C',
          500: '#6B3E27',
          400: '#8A5337',
        },
        gold: {
          50: '#FFFDF5',
          100: '#FFF9D6',
          200: '#FDEEA8',
          300: '#FBE37B',
          400: '#E8C44D',
          500: '#D4AF37', // Ouro Nobre da Carteira
          600: '#BA9225',
          700: '#947016',
          800: '#70510E',
          900: '#4D3608',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFE8A3 0%, #D4AF37 50%, #997321 100%)',
        'gold-gradient-light': 'linear-gradient(135deg, #FFF6D6 0%, #F5D77F 50%, #D4AF37 100%)',
        'gold-metallic': 'linear-gradient(90deg, #B38728 0%, #FBF5B7 25%, #DAA520 50%, #AA771C 75%, #FBF5B7 100%)',
        'leather-radial': 'radial-gradient(circle at 50% 20%, #341A0E 0%, #1A0C07 60%, #100804 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 50px rgba(212, 175, 55, 0.35)',
        'leather-card': '0 20px 40px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
