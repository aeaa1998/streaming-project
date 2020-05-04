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

    public static function getOwnedSongs()
    {
        $id = session('user_id');
        if (in_array(4, self::getPermissions())) {
            $ownedSongs = collect(DB::select('select trackid as id from track'));
            return $ownedSongs->map(function ($song) {
                return $song->id;
            })->toArray();
        } else {
            $ownedSongs = collect(DB::select("
            select DISTINCT(InvoiceLine.TrackId) as id from InvoiceLine
            inner join invoice on invoice.InvoiceId = InvoiceLine.InvoiceId 
            inner join Customer on Customer.CustomerId = invoice.CustomerId
            where customer.UserId = {$id}
            "));
            return $ownedSongs->map(function ($song) {
                return $song->id;
            })->toArray();
        }
    }

    public static function getSongsInCart()
    {
        $id = session('user_id');
        $cartSongs = collect(DB::select("
        select DISTINCT(CartTracks.TrackId) as id from CartTracks
        inner join Cart on Cart.id = CartTracks.cartid 
        where Cart.UserId = {$id}
        "));
        return $cartSongs->map(function ($song) {
            return $song->id;
        })->toArray();
    }
}
