<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <!-- Styles -->
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
        <script src="{{asset('js/app.js')}}" defer></script>
        <title>Streaming</title>
    </head>
    <body>
        <div class="container-fluid" id="artists"></div>
        <script src="{{ asset('js/app.js') }}"></script>
    </body>


</html>