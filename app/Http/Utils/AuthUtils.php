<?php

namespace App\Http\Utils;

use Illuminate\Support\Facades\DB;

class AuthUtils
{
    public static function getPermissions()
    {
        $permissions = collect(DB::select('
        select Permission.permissionId as id from users
        inner join role on role.roleId = users.roleId 
        inner join RolePermission on RolePermission.roleId = role.roleId
        inner join Permission on Permission.permissionId = RolePermission.permissionId
        where users.userid = 1
        '));
        return $permissions->map(function ($permission) {
            return $permission->id;
        })->toArray();
    }
}
