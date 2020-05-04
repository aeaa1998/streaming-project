<?php

namespace App\Http\Controllers;

use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function addTrackToCart(Request $request)
    {
        $userId = $request->session()->get('user_id');
        $cartId = DB::select("select id from Cart where userid = {$userId}")[0]->id;
        $trackId = $request->trackid;
        DB::statement("insert into CartTracks (cartid, trackid, quantity) VALUES ({$cartId}, {$trackId}, 1)");
        return ["message" => "success"];
    }

    public function changeQuantity(Request $request)
    {
        $userId = $request->session()->get('user_id');
        DB::statement("update CartTracks set quantity = {$request->quantity} where id = {$request->id}");
        $rows = "select CartTracks.id, CartTracks.quantity as quantity, Track.name as name, Track.unitprice as unitprice
        from CartTracks 
        inner join Cart on CartTracks.cartid = Cart.id
        inner join Track on CartTracks.trackid = Track.trackid
        where Cart.userid = {$userId}
        order by id DESC
        ";
        return DB::select($rows);
    }

    public function payCart(Request $request)
    {
        $userId = $request->session()->get('user_id');
        $cartId = DB::select("select id from Cart where userid = {$userId}")[0]->id;
        $cartItems = collect(DB::select("select * from CartTracks where cartid = {$cartId}"));
        if ($cartItems->isNotEmpty()) {
            $total = $cartItems->reduce(function ($carry, $item) {
                $track = DB::select("select unitprice, trackid as id from Track where trackid = {$item->trackid}")[0];
                $subtotal = $item->quantity * $track->unitprice;
                return $carry + $subtotal;
            }, 0);
            $customerId = DB::select("select customerid as id from customer where userid = {$userId}")[0]->id;
            $lastInvoice = DB::select("select InvoiceId as id from Invoice order by InvoiceId DESC")[0]->id;
            $newIdInvoice = $lastInvoice + 1;
            DB::statement("insert into Invoice (InvoiceId, CustomerId, InvoiceDate, BillingAddress, BillingCity, BillingCountry, BillingPostalCode, Total)
            VALUES ({$newIdInvoice}, {$customerId}, CURRENT_TIMESTAMP, '', 'Guatemala', 'Guatemala', '70174', {$total})
            ");
            $cartItems->map(function ($cartItem) use ($newIdInvoice) {
                $track = DB::select("select unitprice, trackid as id from Track where trackid = {$cartItem->trackid}")[0];
                $subtotal = $cartItem->quantity * $track->unitprice;
                $lId = DB::select("select InvoiceLineId as id from InvoiceLine order by InvoiceLineId DESC")[0]->id;
                $newId = $lId + 1;
                DB::statement("insert into InvoiceLine (InvoiceLineId, InvoiceId, TrackId, UnitPrice, Quantity) 
                VALUES ({$newId}, {$newIdInvoice}, {$track->id}, {$track->unitprice}, {$cartItem->quantity})");
            });
            DB::statement("delete from CartTracks where cartid = {$cartId}");
        }

        $rows = "select CartTracks.id, CartTracks.quantity as quantity, Track.name as name, Track.unitprice as unitprice
        from CartTracks 
        inner join Cart on CartTracks.cartid = Cart.id
        inner join Track on CartTracks.trackid = Track.trackid
        where Cart.userid = {$userId}
        order by id DESC
        ";
        return DB::select($rows);
    }

    public function cleanCart(Request $request)
    {
        $userId = $request->session()->get('user_id');
        $cartId = DB::select("select id from Cart where userid = {$userId}")[0]->id;
        DB::statement("delete from CartTracks where cartid = {$cartId}");
        $rows = "select CartTracks.id, CartTracks.quantity as quantity, Track.name as name, Track.unitprice as unitprice
        from CartTracks 
        inner join Cart on CartTracks.cartid = Cart.id
        inner join Track on CartTracks.trackid = Track.trackid
        where Cart.userid = {$userId}
        order by id DESC
        ";
        return DB::select($rows);
    }

    public function deleteTrack(Request $request, $id)
    {
        $userId = $request->session()->get('user_id');
        DB::statement("delete from CartTracks where id = {$id}");
        $rows = "select CartTracks.id, CartTracks.quantity as quantity, Track.name as name, Track.unitprice as unitprice
        from CartTracks 
        inner join Cart on CartTracks.cartid = Cart.id
        inner join Track on CartTracks.trackid = Track.trackid
        where Cart.userid = {$userId}
        order by id DESC
        ";
        return DB::select($rows);
    }
}
