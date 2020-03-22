@extends('nav')
@section('content')
<div id="songsByGenre" data='{{ $songsByGenre }}'></div>
<div id="albumsByArtist" data='{{ $albumsByArtist }}'></div>
<div id="avgDurationByGenre" data='{{ $avgDurationByGenre }}'></div>
<div id="songsByArtist" data='{{ $songsByArtist }}'></div>
<div class="container-fluid" id="reports"></div>
@endsection