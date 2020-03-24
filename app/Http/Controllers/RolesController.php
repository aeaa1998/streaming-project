<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Utils\AuthUtils;
use Illuminate\Support\Facades\DB;

class RolesController extends Controller
{
    public function roles()
    {
        $roles =  collect(DB::select(
            "select role.roleid as id, role.name as name, '' as permissions from role  where roleid not in (1,2) order by role.roleid"
        ));
        $rolePermissions =  collect(DB::select(
            "select * from rolepermission"
        ));

        $permissions =  collect(DB::select(
            "select * from permission
            "
        ));
        $permissionsSelect =  collect(DB::select("select permissionid as id, name from permission where permissionid !=4"));

        $roles =  $roles->map(function ($role) use ($rolePermissions, $permissions) {
            $filteredrolePermissions = $rolePermissions->filter(function ($rolePermission) use ($role) {
                return $rolePermission->roleid == $role->id;
            });
            $filteredPermissions = $filteredrolePermissions->map(function ($rolePermission) use ($permissions) {
                return $permissions->filter(function ($permission) use ($rolePermission) {
                    return $permission->permissionid ==  $rolePermission->permissionid;
                })->first();
            })->pluck('name')->flatten()->join(", ");

            $role->permissions = $filteredPermissions;
            return $role;
        });
        return view('roles')
            ->with('permissions', json_encode(AuthUtils::getPermissions()))
            ->with('rows', json_encode($roles))
            ->with('permissionsSelect', json_encode($permissionsSelect));
    }

    public function getRoles()
    {
        $roles =  collect(DB::select(
            "select role.roleid as id, role.name as name, '' as permissions from role where roleid not in (1,2) order by role.roleid
            "
        ));
        $rolePermissions =  collect(DB::select(
            "select * from rolepermission
            "
        ));

        $permissions =  collect(DB::select(
            "select * from permission
            "
        ));

        return $roles->map(function ($role) use ($rolePermissions, $permissions) {
            $filteredrolePermissions = $rolePermissions->filter(function ($rolePermission) use ($role) {
                return $rolePermission->roleid == $role->id;
            });
            $filteredPermissions = $filteredrolePermissions->map(function ($rolePermission) use ($permissions) {
                return $permissions->filter(function ($permission) use ($rolePermission) {
                    return $permission->permissionid ==  $rolePermission->permissionid;
                })->first();
            })->pluck('name')->flatten()->join(", ");

            $role->permissions = $filteredPermissions;
            return $role;
        });
        return $roles;
    }

    public function getRolesByPermission(Request $request)
    {

        $ids = json_decode($request->parameters)->ids;
        $rolesSelect =  "select role.roleid as id, role.name as name, '' as permissions from role ";
        $ids = join(", ", $ids);

        if ($ids) {
            $rolesSelect .= " 
            inner join rolepermission on rolepermission.roleid = role.roleid
            where roleid not in (1,2)
            and rolepermission.permissionid in ({$ids})
            group by role.roleid 
            ";
        } else {
            $rolesSelect .= " where roleid not in (1,2) ";
        }

        $roles =  collect(DB::select($rolesSelect));

        $rolePermissions =  collect(DB::select(
            "select * from rolepermission
            "
        ));

        $permissions =  collect(DB::select(
            "select * from permission"
        ));

        $roles = $roles->map(function ($role) use ($rolePermissions, $permissions) {
            $filteredrolePermissions = $rolePermissions->filter(function ($rolePermission) use ($role) {
                return $rolePermission->roleid == $role->id;
            });
            $filteredPermissions = $filteredrolePermissions->map(function ($rolePermission) use ($permissions) {
                return $permissions->filter(function ($permission) use ($rolePermission) {
                    return $permission->permissionid ==  $rolePermission->permissionid;
                })->first();
            })->pluck('name')->flatten()->join(", ");

            $role->permissions = $filteredPermissions;
            return $role;
        });
        return $roles;
    }
    public function getRolesByName(Request $request)
    {
        $name = json_decode($request->parameters)->name;

        $query = "select role.roleid as id, role.name as name, '' as permissions from role where roleid not in (1,2)";
        if ($name) $query .= " and role.name like '{$name}%'";
        $query .= " order by role.roleid";
        $roles =  collect(DB::select($query));
        $rolePermissions =  collect(DB::select(
            "select * from rolepermission
            "
        ));

        $permissions =  collect(DB::select(
            "select * from permission"
        ));

        $roles = $roles->map(function ($role) use ($rolePermissions, $permissions) {
            $filteredrolePermissions = $rolePermissions->filter(function ($rolePermission) use ($role) {
                return $rolePermission->roleid == $role->id;
            });
            $filteredPermissions = $filteredrolePermissions->map(function ($rolePermission) use ($permissions) {
                return $permissions->filter(function ($permission) use ($rolePermission) {
                    return $permission->permissionid ==  $rolePermission->permissionid;
                })->first();
            })->pluck('name')->flatten()->join(", ");

            $role->permissions = $filteredPermissions;
            return $role;
        });
        return $roles;
    }

    public function getRolesByBoth(Request $request)
    {

        $name = json_decode($request->parameters)->name;
        $ids = json_decode($request->parameters)->ids;

        $ids = join(", ",  $ids);
        $rolesSelect =  "select role.roleid as id, role.name as name, '' as permissions from role ";

        if ($ids) {
            $rolesSelect .= " 
            inner join rolepermission on rolepermission.roleid = role.roleid
            where role.roleid not in (1,2)
            and rolepermission.permissionid in ({$ids})
            ";
        } else {
            $rolesSelect .= " where role.roleid not in (1,2) ";
        }

        if ($name) $rolesSelect .= " and role.name like '{$name}%'";
        $rolesSelect .= " group by role.roleid  order by role.roleid";

        $roles =  collect(DB::select($rolesSelect));
        $rolePermissions =  collect(DB::select(
            "select * from rolepermission
            "
        ));

        $permissions =  collect(DB::select(
            "select * from permission"
        ));

        $roles = $roles->map(function ($role) use ($rolePermissions, $permissions) {
            $filteredrolePermissions = $rolePermissions->filter(function ($rolePermission) use ($role) {
                return $rolePermission->roleid == $role->id;
            });
            $filteredPermissions = $filteredrolePermissions->map(function ($rolePermission) use ($permissions) {
                return $permissions->filter(function ($permission) use ($rolePermission) {
                    return $permission->permissionid ==  $rolePermission->permissionid;
                })->first();
            })->pluck('name')->flatten()->join(", ");

            $role->permissions = $filteredPermissions;
            return $role;
        });
        return $roles;
    }

    public function edit(Request $request)
    {
        $id = $request->id;

        if ($request->has('name')) {
            $name = $request->name;
            DB::statement("UPDATE role SET name = '{$name}' WHERE roleid = {$id}");
        }
        if ($request->has('permissionIds')) {
            DB::statement("DELETE from rolepermission  WHERE roleid = {$id}");
            array_map(function ($permissionId) use ($id) {
                DB::statement("INSERT INTO rolepermission (roleid, permissionid) VALUES ({$id}, {$permissionId})");
            }, $request->permissionIds);
        }
        $roles =  collect(DB::select(
            "select role.roleid as id, role.name as name, '' as permissions from role where role.roleid not in (1,2) order by role.roleid "
        ));
        $rolePermissions =  collect(DB::select(
            "select * from rolepermission
            "
        ));

        $permissions =  collect(DB::select(
            "select * from permission
            "
        ));


        $roles =  $roles->map(function ($role) use ($rolePermissions, $permissions) {
            $filteredrolePermissions = $rolePermissions->filter(function ($rolePermission) use ($role) {
                return $rolePermission->roleid == $role->id;
            });
            $filteredPermissions = $filteredrolePermissions->map(function ($rolePermission) use ($permissions) {
                return $permissions->filter(function ($permission) use ($rolePermission) {
                    return $permission->permissionid ==  $rolePermission->permissionid;
                })->first();
            })->pluck('name')->flatten()->join(", ");

            $role->permissions = $filteredPermissions;
            return $role;
        });
        return [
            "rows" => $roles,
            "selected" => $roles->filter(function ($role) use ($id) {
                return $role->id == $id;
            })->first()
        ];
    }


    public function create(Request $request)
    {
        $name = $request->name;

        $role = DB::select(DB::raw("INSERT INTO role (name) VALUES ('{$name}') returning roleid"));

        array_map(function ($permissionId) use ($role) {
            $id = $role[0]->roleid;
            DB::statement("INSERT INTO rolepermission (roleid, permissionid) VALUES ({$id}, {$permissionId})");
        }, $request->permissionIds);

        $roles =  collect(DB::select(
            "select role.roleid as id, role.name as name, '' as permissions from role where role.roleid not in (1,2) order by role.roleid "
        ));
        $rolePermissions =  collect(DB::select(
            "select * from rolepermission
            "
        ));

        $permissions =  collect(DB::select(
            "select * from permission
            "
        ));


        $roles =  $roles->map(function ($role) use ($rolePermissions, $permissions) {
            $filteredrolePermissions = $rolePermissions->filter(function ($rolePermission) use ($role) {
                return $rolePermission->roleid == $role->id;
            });
            $filteredPermissions = $filteredrolePermissions->map(function ($rolePermission) use ($permissions) {
                return $permissions->filter(function ($permission) use ($rolePermission) {
                    return $permission->permissionid ==  $rolePermission->permissionid;
                })->first();
            })->pluck('name')->flatten()->join(", ");

            $role->permissions = $filteredPermissions;
            return $role;
        });
        return $roles;
    }

    public function delete($id)
    {

        DB::statement("DELETE from rolepermission  WHERE roleid = {$id}");
        DB::statement("DELETE from role  WHERE roleid = {$id}");
        $roles =  collect(DB::select(
            "select role.roleid as id, role.name as name, '' as permissions from role where role.roleid not in (1,2) order by role.roleid "
        ));
        $rolePermissions =  collect(DB::select(
            "select * from rolepermission
            "
        ));

        $permissions =  collect(DB::select(
            "select * from permission
            "
        ));
        $roles =  $roles->map(function ($role) use ($rolePermissions, $permissions) {
            $filteredrolePermissions = $rolePermissions->filter(function ($rolePermission) use ($role) {
                return $rolePermission->roleid == $role->id;
            });
            $filteredPermissions = $filteredrolePermissions->map(function ($rolePermission) use ($permissions) {
                return $permissions->filter(function ($permission) use ($rolePermission) {
                    return $permission->permissionid ==  $rolePermission->permissionid;
                })->first();
            })->pluck('name')->flatten()->join(", ");

            $role->permissions = $filteredPermissions;
            return $role;
        });
        return  $roles;
    }
}
