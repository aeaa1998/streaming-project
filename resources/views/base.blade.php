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
    <div class="container-fluid min-vh-100" style="padding: 0px">
        <div id="navbar"></div>
        <div id="permissions" data='{{ $permissions }}'></div>
        <div id="rows" data='{{ $rows }}'></div>
        <input type="hidden" id="token_l" value="{{csrf_token()}}">
        @isset($userId)
        <input type="hidden" id="userId" value="{{$userId}}">
        @endisset
        @isset($filteredJson)
        <div id="filterJson" data='{{ ($filteredJson ? json_encode($filteredJson) : json_encode([])) }}'></div>
        @endisset
        @isset($createForm)
        <div id="createForm" data='{{ ($createForm ? json_encode($createForm) : json_encode([])) }}'></div>
        @endisset
        @yield('content')

    </div>
</body>
<script src="{{ asset('js/app.js') }}"></script>
@yield('extra-scripts')

</html>