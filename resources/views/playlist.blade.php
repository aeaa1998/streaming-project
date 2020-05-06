@extends('base')
@section('content')
<div id="allSongs" data='{{ $allSongs }}'></div>
<div id="allArtists" data='{{ $allArtists }}'></div>
<div id="allAlbums" data='{{ $allAlbums }}'></div>
<div class="container-fluid" id="playlist"></div>
@endsection