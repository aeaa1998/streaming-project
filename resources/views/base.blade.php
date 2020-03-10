<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2c5fa1">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="theme-color" content="#ffffff">

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Streaming</title>

        <!-- Styles -->
        <link rel="stylesheet" type="text/css" href="{{ assetPath('css/app.css') }}">
    </head>
    <body>
        <div class="container-fluid" id="app" style="padding: 0px">
            @yield('content')
        </div>
    </body>
    <script src="{{ assetPath('js/manifest.js') }}"></script>
    <script src="{{ assetPath('js/vendor.js') }}"></script>
    <script src="{{ assetPath('js/app.js') }}"></script>
    @yield('extra-scripts')
</html>
