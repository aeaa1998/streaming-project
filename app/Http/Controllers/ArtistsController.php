<?php

namespace App\Http\Controllers;
use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArtistsController extends Controller {
	public function index() {
		return DB::select("SELECT * FROM Artist");
	}

	public function filtered(Request $request) {

		$query      = "SELECT ArtistId AS id, name FROM Artist";
		$parameters = [
			'ArtistId' => ['operator' => '=', 'value' => $request->id],
			'name'     => ['operator' => '=', 'value' => $request->name ? "'{$request->name}'" : null],
		];

		return DB::select(QueryBuilder::build($parameters, $query));
	}

}
