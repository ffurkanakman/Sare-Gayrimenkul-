<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ __('Sare Gayrimenkul Müşteri Takip Sistemi') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link rel="icon" type="image/png" href="{{ asset('media/logos/fav.png') }}">

    <!-- Scripts -->

    @viteReactRefresh
    @vite(['resources/globals.scss', 'resources/js/app.jsx'])

</head>
<body class="font-sans antialiased">
<div id="fsh"></div>
</body>
</html>
