<?php

namespace App\Http\Utils;

use Illuminate\Support\Facades\DB;

class AuthUtils
{
    public static function getPermissions()
    {
        $id = session('user_id');
        $permissions = collect(DB::select("
        select Permission.permissionId as id from users
        inner join role on role.roleId = users.roleId 
        inner join RolePermission on RolePermission.roleId = role.roleId
        inner join Permission on Permission.permissionId = RolePermission.permissionId
        where users.userid = {$id}
        "));
        return $permissions->map(function ($permission) {
            return $permission->id;
        })->toArray();
    }
}
