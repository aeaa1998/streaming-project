<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SimulationController extends Controller
{
    public function view(Request $request)
    {
        return view('simulations');
    }

    public function simulate(Request $request)
    {
        $selectedDate = Carbon::parse($request->date)->toDateTimeString();
        $numberOfTracks = $request->numberOfTracks;
        $numberOfCustomers = DB::select("select count(*) count from customer")[0]->count;
        $countTracksDB = DB::select("select count(*) count from track")[0]->count;
        $customers = collect([]);
        for ($i = 0; $i < 3; $i++) {
            $cusotmer = DB::select("select customerid as id, userid from customer OFFSET floor(random()*{$numberOfCustomers}) LIMIT 1")[0];
            $customers->push($cusotmer);
        }
        $customers->map(function ($customer) use ($numberOfTracks, $countTracksDB, $selectedDate) {
            $tracks = collect([]);
            $total = 0;
            for ($i = 0; $i < $numberOfTracks; $i++) {
                $track = DB::select("select trackid as id, unitprice as price from track OFFSET floor(random()*{$countTracksDB}) LIMIT 1")[0];
                $tracks->push($track);
                $total += $track->price;
            }
            $lastInvoice = DB::select("select invoiceid as id from invoice order by invoiceid DESC Limit 1")[0]->id + 1;
            DB::statement(
                "insert into invoice 
            (invoiceid, customerid, invoicedate, billingaddress, billingcity, billingstate, billingcountry, billingpostalcode, total)
            VALUES
            ({$lastInvoice}, {$customer->id}, '{$selectedDate}', 'not defined', 'Guatemala', 'Guatemala', 'Guatemala', '12345', {$total})"
            );
            $tracks->map(function ($track) use ($lastInvoice, $customer) {
                $lastInvoiceLine = DB::select("select invoicelineid as id from invoiceline order by invoicelineid DESC Limit 1")[0]->id + 1;
                DB::statement("
                insert into invoiceline (invoicelineid, invoiceid, trackid, unitprice, quantity) VALUES
                ({$lastInvoiceLine}, {$lastInvoice}, {$track->id}, {$track->price}, 1)
                ");
                DB::statement("insert into trackplayrecord (userid, trackid) VALUES ({$customer->userid}, $track->id)");
            });
        });


        return ["message" => "success"];
    }
}
