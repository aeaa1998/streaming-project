<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Utils\AuthUtils;
use Illuminate\Support\Facades\DB;

class AuditsController extends Controller
{
    public function audits()
    {
        $tableSelect = ["artist" => 'Artista', 'track' => "Canciones", "playlist" => "Playlist", 'album' => "Album"];
        $typeSelect = ["update" => 'Actualización', 'insert' => "Nuevo ingreso", "delete" => "Borrar", "REMOVE_SONG" => "Borro cancion de playlist", "NEW_SONG" => "Agrego cancion a playlist"];
        $tableSelect = collect($tableSelect)->map(function ($item, $key) {
            return [
                'id' => $key,
                'name' => $item
            ];
        })->values();
        $typeSelect = collect($typeSelect)->map(function ($item, $key) {
            return [
                'id' => $key,
                'name' => $item
            ];
        })->values();
        $audits =  collect(DB::select(
            "select audit.id as id, audit.event as event, audit.auditabletype as table, audit.auditableid as idTable, audit.columnname as column
            , audit.oldvalue as oldvalue, audit.newvalue as newvalue, userid as user, audit.created_at as date
             from audit order by audit.id"
        ));
        $users =  collect(DB::select("select * from users"));

        $audits =  $audits->map(function ($audit) use ($users) {
            $user = $users->firstWhere('userid', $audit->user);
            if ($user) {
                $audit->user = $user->name;
            } else {
                $audit->user = 'No definido';
            }
            return $audit;
        });
        return view('audits')
            ->with('permissions', json_encode(AuthUtils::getPermissions()))
            ->with('rows', json_encode($audits))
            ->with('tableSelect', json_encode($tableSelect))
            ->with('typeSelect', json_encode($typeSelect));
    }

    public function getAudits()
    {
        $tableSelect = ["artist" => 'Artista', 'track' => "Canciones", "playlist" => "Playlist", 'album', "Album"];
        $typeSelect = ["update" => 'Actualización', 'insert' => "Nuevo ingreso", "delete" => "Borrar"];
        $tableSelect = collect($tableSelect)->map(function ($item, $key) {
            return [
                'id' => $key,
                'name' => $item
            ];
        });
        $typeSelect = collect($typeSelect)->map(function ($item, $key) {
            return [
                'id' => $key,
                'name' => $item
            ];
        });
        $audits =  collect(DB::select(
            "select audit.id as id, audit.event as event, audit.auditabletype as table, audit.auditableid as idTable, audit.columnname as column
            , audit.oldvalue as oldvalue, audit.newvalue as newvalue, userid as user, audit.created_at as date
             from audit order by audit.id"
        ));
        $users =  collect(DB::select("select * from users"));

        $audits =  $audits->map(function ($audit) use ($users) {
            $user = $users->firstWhere('userid', $audit->user);
            if ($user) {
                $audit->user = $user->name;
            } else {
                $audit->user = 'No definido';
            }
            return $audit;
        });
        return $audits;
    }

    public function byTable(Request $request)
    {

        $ids = json_decode($request->parameters)->ids;
        $select =  "select audit.id as id, audit.event as event, audit.auditabletype as table, audit.auditableid as idTable, audit.columnname as column
        , audit.oldvalue as oldvalue, audit.newvalue as newvalue, userid as user, audit.created_at as date from audit ";
        $ids = array_map(function ($value) {
            return "'${value}'";
        }, $ids);
        $ids = join(", ", $ids);

        if ($ids) {
            $select .= " where lower(audit.auditabletype) in ({$ids}) ";
        }
        $audits = collect(DB::select($select));
        $users =  collect(DB::select("select * from users"));
        $audits =  $audits->map(function ($audit) use ($users) {
            $user = $users->firstWhere('userid', $audit->user);
            if ($user) {
                $audit->user = $user->name;
            } else {
                $audit->user = 'No definido';
            }
            return $audit;
        });
        return $audits;
    }
    public function byTypes(Request $request)
    {

        $ids = json_decode($request->parameters)->ids;
        $select =  "select audit.id as id, audit.event as event, audit.auditabletype as table, audit.auditableid as idTable, audit.columnname as column
        , audit.oldvalue as oldvalue, audit.newvalue as newvalue, userid as user, audit.created_at as date from audit ";
        $ids = array_map(function ($value) {
            return "'${value}'";
        }, $ids);
        $ids = join(", ", $ids);

        if ($ids) {
            $select .= " where lower(audit.event) in ({$ids})";
        }
        $audits = collect(DB::select($select));
        $users =  collect(DB::select("select * from users"));

        $audits =  $audits->map(function ($audit) use ($users) {
            $user = $users->firstWhere('userid', $audit->user);
            if ($user) {
                $audit->user = $user->name;
            } else {
                $audit->user = 'No definido';
            }
            return $audit;
        });
        return $audits;
    }


    public function byBoth(Request $request)
    {

        $tablesIds = json_decode($request->parameters)->tablesIds;
        $typesIds = json_decode($request->parameters)->typesIds;

        $tablesIds = array_map(function ($value) {
            return "'${value}'";
        }, $tablesIds);
        $tablesIds = join(", ", $tablesIds);
        $typesIds = array_map(function ($value) {
            return "'${value}'";
        }, $typesIds);
        $typesIds = join(", ", $typesIds);
        $select =  "select audit.id as id, audit.event as event, audit.auditabletype as table, audit.auditableid as idTable, audit.columnname as column
        , audit.oldvalue as oldvalue, audit.newvalue as newvalue, userid as user, audit.created_at as date from audit ";
        $count = 0;
        if ($tablesIds) {
            $select .= " where lower(audit.auditabletype) in ({$tablesIds}) ";
            $count++;
        }

        if ($typesIds) {
            if ($count == 0) {
                $select .= " where";
            } else {
                $select .= " and";
            }
            $select .= " lower(audit.event) in ({$typesIds}) ";
            $count++;
        }


        $audits = collect(DB::select($select));
        $users =  collect(DB::select("select * from users"));

        $audits =  $audits->map(function ($audit) use ($users) {
            $user = $users->firstWhere('userid', $audit->user);
            if ($user) {
                $audit->user = $user->name;
            } else {
                $audit->user = 'No definido';
            }
            return $audit;
        });
        return $audits;
    }
}
