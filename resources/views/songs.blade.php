@extends('base')
@section('content')
<div id="ownedSongs" data='{{ $ownedSongs }}'></div>
<div id="songsInCart" data='{{ $songsInCart }}'></div>
<div class="container-fluid" id="songs"></div>
@endsection