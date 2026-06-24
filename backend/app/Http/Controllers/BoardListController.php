<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\Request;

class BoardListController extends Controller
{
    public function index(Board $board)
    {
        return $board->lists()->get();
    }

    public function store(Request $request, Board $board)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'board_id' => ['required', 'exists:boards,id'],
            'position' => ['sometimes', 'integer'],
        ]);

        if ((int) $data['board_id'] !== $board->id) {
            abort(422, 'board_id must match the route board.');
        }

        return response()->json(BoardList::create($data), 201);
    }

    public function show(Board $board, BoardList $list)
    {
        return $list;
    }

    public function update(Request $request, Board $board, BoardList $list)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'position' => ['sometimes', 'integer'],
        ]);

        $list->update($data);

        return $list;
    }

    public function destroy(Board $board, BoardList $list)
    {
        $list->delete();

        return response()->noContent();
    }
}
