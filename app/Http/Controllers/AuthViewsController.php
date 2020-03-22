<?php

namespace App\Http\Controllers;

use App\Http\Utils\AuthUtils;
use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use  App\Http\Utils\Constants;

class AuthViewsController extends Controller
{
    public function adminUsers()
    {
        return view('users')->with('rows', json_encode(DB::select(Constants::USER_URL)))
            ->with('permissions', json_encode(AuthUtils::getPermissions()))->with(
                'filteredJson',
                array_merge(
                    [
                        "Rol" => [
                            "operator" => "LIKE",
                            "column" => "Role.name",
                            "columnEdit" => "roleid",
                            "type" => "text",
                            "tableName" => "rol",
                            "queryType" => "select",
                            "values" => DB::select("select roleid as id, name from Role where roleid != 1 order by name asc"),
                        ],
                        "Suscripcion" => [
                            "operator" => "LIKE",
                            "column" => "SubsriptionType.name",
                            "columnEdit" => "subscriptionTypeId",
                            "type" => "text",
                            "tableName" => "subs",
                            "queryType" => "select",
                            "values" => DB::select("select subscriptionTypeId as id, name from SubsriptionType where subscriptionTypeId != 1 order by name asc"),
                        ],
                    ],
                    Constants::USER_FILTERS
                )
            )->with(
                'createForm',
                array_merge(
                    Constants::CREATE_USER,
                    [
                        [
                            "column" => "roleid",
                            "name" => "Role",
                            "type" => "select",
                            "values" => DB::select("select roleid as id, name from Role where roleid != 1 order by name asc"),
                            "value" => ""
                        ],
                        [
                            "column" => "subscriptionTypeId",
                            "name" => "Suscripcion",
                            "type" => "select",
                            "values" => DB::select("select subscriptionTypeId as id, name from SubsriptionType where subscriptionTypeId != 1 order by name asc"),
                            "value" => ""
                        ],
                    ]
                )
            );
    }
}
