<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        return Board::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        return response()->json(Board::create($data), 201);
    }

    public function show(Board $board)
    {
        return $board->load('lists.cards.tags', 'lists.cards.members');
    }

    public function update(Request $request, string $id)
    {
        abort(404);
    }

    public function destroy(Board $board)
    {
        $board->delete();

        return response()->noContent();
    }
}
