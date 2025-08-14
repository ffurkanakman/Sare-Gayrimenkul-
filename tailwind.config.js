import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'

export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,jsx,ts,tsx}',
        './Modules/**/*.blade.php',                      // modüler yapıyı da tara
        './resources/js/Libs/Metronic/**/*.{js,jsx}',    // metronic jsx’ler
    ],
    theme: {
        extend: { fontFamily: { sans: ['Figtree', ...defaultTheme.fontFamily.sans] } },
    },
    plugins: [forms],
}
