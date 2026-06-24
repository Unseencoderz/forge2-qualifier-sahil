<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'board_id' => ['required', 'exists:boards,id'],
        ]);

        return Member::where('board_id', $data['board_id'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'board_id' => ['required', 'exists:boards,id'],
        ]);

        return response()->json(Member::create($data), 201);
    }

    public function show(Member $member)
    {
        return $member;
    }

    public function update(Request $request, string $id)
    {
        abort(404);
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return response()->noContent();
    }
}
