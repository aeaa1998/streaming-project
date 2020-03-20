<?php

namespace App\Http\Utils;

use Illuminate\Support\Facades\DB;

class AuthUtils
{
    public static function getPermissions()
    {
        $permissions = collect(DB::select('
        select Permission.id as id from users
        inner join role on role.id = users.roleId 
        inner join RolePermission on RolePermission.roleId = role.id
        inner join Permission on Permission.id = RolePermission.permissionId
        where users.id = 1
        '));
        return $permissions->map(function ($permission) {
            return $permission->id;
        })->toArray();
    }
}
