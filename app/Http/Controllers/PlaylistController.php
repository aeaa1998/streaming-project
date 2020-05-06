<?php

namespace App\Http\Controllers;

use App\Http\Utils\AuthUtils;
use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlaylistController extends Controller
{
    public function view()
    {
        $query = "select playlist.playlistid as id, playlist.name as name, '' as detail from playlist";

        $rows = collect(DB::select($query));
        $rows = $rows->map(function ($row) {
            $detail =  "select Track.trackid as trackid, Track.name as nameSong, Album.title as nameAlbum, Artist.name as nameArtist from playlist
            inner join playlisttrack on playlist.playlistid = playlisttrack.playlistid
            inner join track on playlisttrack.trackid = track.trackid
            inner join Album on Album.albumid = Track.albumid
            inner join Artist on Artist.Artistid = Album.artistid
            where playlist.playlistid = {$row->id}
            ";
            $row->detail = DB::select($detail);
            return $row;
        });
        $allSongs = DB::select('select trackid as id, name from track where trackid in (select trackid from playlisttrack)');
        $allArtists = DB::select('select artistid as id, name from Artist');
        $allAlbums = DB::select('select albumid as id, title as name from Album');
        return view('playlist')->with('permissions', json_encode(AuthUtils::getPermissions()))
            ->with('rows', $rows)
            ->with('allSongs', json_encode($allSongs))
            ->with('allArtists', json_encode($allArtists))
            ->with('allAlbums', json_encode($allAlbums));
    }
    public function getPlaylists()
    {
        $query = "select playlist.playlistid as id, playlist.name as name, '' as detail from playlist";

        $rows = collect(DB::select($query));
        $rows = $rows->map(function ($row) {
            $detail =  "select Track.trackid as trackid, Track.name as nameSong, Album.title as nameAlbum, Artist.name as nameArtist from playlist
            inner join playlisttrack on playlist.playlistid = playlisttrack.playlistid
            inner join track on playlisttrack.trackid = track.trackid
            inner join Album on Album.albumid = Track.albumid
            inner join Artist on Artist.Artistid = Album.artistid
            where playlist.playlistid = {$row->id}
            ";
            $row->detail = DB::select($detail);
            return $row;
        });
        return $rows;
    }
    public function addPlaylist(Request $request)
    {
        $userId = $request->session()->get('user_id');
        $playlistName = $request->name;
        $songs = $request->songs;
        $lId = DB::select("select PlaylistId as id from Playlist order by PlaylistId DESC")[0]->id;
        $newId = $lId + 1;
        DB::statement("insert into Playlist (playlistid, name) VALUES ({$newId} , '{$playlistName}')");
        collect($songs)->map(function ($song) use ($newId) {
            DB::statement("insert into PlaylistTrack (PlaylistId, TrackId) VALUES ({$newId}, {$song})");
        });
        $query = "select playlist.playlistid as id, playlist.name as name, '' as detail from playlist";

        $rows = collect(DB::select($query));
        $rows = $rows->map(function ($row) {
            $detail =  "select Track.trackid as trackid, Track.name as nameSong, Album.title as nameAlbum, Artist.name as nameArtist from playlist
            inner join playlisttrack on playlist.playlistid = playlisttrack.playlistid
            inner join track on playlisttrack.trackid = track.trackid
            inner join Album on Album.albumid = Track.albumid
            inner join Artist on Artist.Artistid = Album.artistid
            where playlist.playlistid = {$row->id}
            ";
            $row->detail = DB::select($detail);
            return $row;
        });
        return $rows;
    }

    public function addSongstoPlaylist(Request $request)
    {
        $userId = $request->session()->get('user_id');
        $playlistId = $request->id;
        $songs = $request->songs;
        collect($songs)->map(function ($song) use ($playlistId) {
            DB::statement("insert into PlaylistTrack (PlaylistId, TrackId) VALUES ({$playlistId}, {$song})");
        });
        $query = "select playlist.playlistid as id, playlist.name as name, '' as detail from playlist";

        $rows = collect(DB::select($query));
        $rows = $rows->map(function ($row) {
            $detail =  "select Track.trackid as trackid, Track.name as nameSong, Album.title as nameAlbum, Artist.name as nameArtist from playlist
            inner join playlisttrack on playlist.playlistid = playlisttrack.playlistid
            inner join track on playlisttrack.trackid = track.trackid
            inner join Album on Album.albumid = Track.albumid
            inner join Artist on Artist.Artistid = Album.artistid
            where playlist.playlistid = {$row->id}
            ";
            $row->detail = DB::select($detail);
            return $row;
        });
        return ["rows" => $rows, "selected" => $rows->firstWhere('id', '=', $playlistId)];
    }

    public function deleteSongsFromPlaylist(Request $request)
    {
        $playlistId = $request->id;
        $songs = $request->songs;
        collect($songs)->map(function ($song) use ($playlistId) {
            DB::statement("delete from PlaylistTrack where playlistId = {$playlistId} and trackid = {$song}");
        });
        $query = "select playlist.playlistid as id, playlist.name as name, '' as detail from playlist";

        $rows = collect(DB::select($query));
        $rows = $rows->map(function ($row) {
            $detail =  "select Track.trackid as trackid, Track.name as nameSong, Album.title as nameAlbum, Artist.name as nameArtist from playlist
            inner join playlisttrack on playlist.playlistid = playlisttrack.playlistid
            inner join track on playlisttrack.trackid = track.trackid
            inner join Album on Album.albumid = Track.albumid
            inner join Artist on Artist.Artistid = Album.artistid
            where playlist.playlistid = {$row->id}
            ";
            $row->detail = DB::select($detail);
            return $row;
        });
        return ["rows" => $rows, "selected" => $rows->firstWhere('id', '=', $playlistId)];
    }

    public function editPlaylist(Request $request)
    {
        $playlistId = $request->id;
        $name = $request->name;
        $userId = $request->session()->get('user_id');
        DB::statement("update playlist set name = '{$name}' where playlistid = {$playlistId}");
        DB::statement("update audit set userid = {$userId} where auditabletype = 'playlist' and auditableid = {$playlistId}");
        $query = "select playlist.playlistid as id, playlist.name as name, '' as detail from playlist";

        $rows = collect(DB::select($query));
        $rows = $rows->map(function ($row) {
            $detail =  "select Track.trackid as trackid, Track.name as nameSong, Album.title as nameAlbum, Artist.name as nameArtist from playlist
            inner join playlisttrack on playlist.playlistid = playlisttrack.playlistid
            inner join track on playlisttrack.trackid = track.trackid
            inner join Album on Album.albumid = Track.albumid
            inner join Artist on Artist.Artistid = Album.artistid
            where playlist.playlistid = {$row->id}
            ";
            $row->detail = DB::select($detail);
            return $row;
        });
        return ["rows" => $rows, "selected" => $rows->firstWhere('id', '=', $playlistId)];
    }

    public function deletePlaylist(Request $request, $playlistId)
    {

        DB::statement("delete from playlisttrack where playlistid = {$playlistId}");
        DB::statement("delete from playlist where playlistid = {$playlistId}");
        $query = "select playlist.playlistid as id, playlist.name as name, '' as detail from playlist";

        $rows = collect(DB::select($query));
        $rows = $rows->map(function ($row) {
            $detail =  "select Track.trackid as trackid, Track.name as nameSong, Album.title as nameAlbum, Artist.name as nameArtist from playlist
            inner join playlisttrack on playlist.playlistid = playlisttrack.playlistid
            inner join track on playlisttrack.trackid = track.trackid
            inner join Album on Album.albumid = Track.albumid
            inner join Artist on Artist.Artistid = Album.artistid
            where playlist.playlistid = {$row->id}
            ";
            $row->detail = DB::select($detail);
            return $row;
        });
        return $rows;
    }

    public function bySongs(Request $request)
    {

        $ids = json_decode($request->parameters)->ids;
        $select =  "select distinct playlist.playlistid as id
        from playlist
        left join playlisttrack on playlist.playlistid = playlisttrack.playlistid
        left join track on playlisttrack.trackid = track.trackid
        left join Album on Album.albumid = Track.albumid
        left join Artist on Artist.Artistid = Album.artistid";
        $ids = array_map(function ($value) {
            return "'${value}'";
        }, $ids);
        $ids = join(", ", $ids);

        if ($ids) {
            $select .= " where Track.trackid in ({$ids}) ";
        }
        $rows = collect(DB::select($select));


        return $rows;
    }

    public function byAlbums(Request $request)
    {

        $ids = json_decode($request->parameters)->ids;
        $select =  "select distinct playlist.playlistid as id
        from playlist
        left join playlisttrack on playlist.playlistid = playlisttrack.playlistid
        left join track on playlisttrack.trackid = track.trackid
        left join Album on Album.albumid = Track.albumid
        left join Artist on Artist.Artistid = Album.artistid";
        $ids = array_map(function ($value) {
            return "'${value}'";
        }, $ids);
        $ids = join(", ", $ids);

        if ($ids) {
            $select .= " where Album.albumid in ({$ids}) ";
        }
        $rows = collect(DB::select($select));

        return $rows;
    }
    public function byArtists(Request $request)
    {

        $ids = json_decode($request->parameters)->ids;

        $select =  "select distinct playlist.playlistid as id
        from playlist
        left join playlisttrack on playlist.playlistid = playlisttrack.playlistid
        left join track on playlisttrack.trackid = track.trackid
        left join Album on Album.albumid = Track.albumid
        left join Artist on Artist.Artistid = Album.artistid";
        $ids = array_map(function ($value) {
            return "'${value}'";
        }, $ids);
        $ids = join(", ", $ids);

        if ($ids) {
            $select .= " where Artist.artistid in ({$ids}) ";
        }
        $rows = collect(DB::select($select));


        return $rows;
    }

    public function byName(Request $request)
    {
        $name = json_decode($request->parameters)->name;
        $select =  "select distinct playlist.playlistid as id
        from playlist ";


        $select .= " where playlist.name like '{$name}%' ";

        $rows = collect(DB::select($select));

        return $rows;
    }
}
