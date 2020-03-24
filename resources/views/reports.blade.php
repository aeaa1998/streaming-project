@extends('nav')
@section('content')
<div id="albumsByArtist" data='{{ $albumsByArtist }}'></div>
<div id="songsByGenre" data='{{ $songsByGenre }}'></div>
<div id="durationByPlaylist" data='{{ $durationByPlaylist }}'></div>
<div id="durationBySong" data='{{ $durationBySong }}'></div>
<div id="songsByArtist" data='{{ $songsByArtist }}'></div>
<div id="durationByGenre" data='{{ $durationByGenre }}'></div>
<div id="artistByPlaylist" data='{{ $artistByPlaylist }}'></div>
<div id="genresByArtist" data='{{ $genresByArtist }}'></div>
<div class="container-fluid" id="reports"></div>
@endsection