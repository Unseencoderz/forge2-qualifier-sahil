<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Member;
use App\Models\Tag;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'board_list_id' => ['required', 'exists:board_lists,id'],
        ]);

        return Card::with('tags', 'members')
            ->where('board_list_id', $data['board_list_id'])
            ->orderBy('position')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'board_list_id' => ['required', 'exists:board_lists,id'],
            'position' => ['sometimes', 'integer'],
        ]);

        return response()->json(Card::create($data)->load('tags', 'members'), 201);
    }

    public function show(Card $card)
    {
        return $card->load('tags', 'members');
    }

    public function update(Request $request, Card $card)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'board_list_id' => ['sometimes', 'exists:board_lists,id'],
            'position' => ['sometimes', 'integer'],
        ]);

        $card->update($data);

        return $card->load('tags', 'members');
    }

    public function destroy(Card $card)
    {
        $card->delete();

        return response()->noContent();
    }

    public function move(Request $request, Card $card)
    {
        $data = $request->validate([
            'board_list_id' => ['required', 'exists:board_lists,id'],
            'position' => ['required', 'integer'],
        ]);

        $card->update($data);

        return $card->load('tags', 'members');
    }

    public function attachTag(Card $card, Tag $tag)
    {
        $card->tags()->syncWithoutDetaching([$tag->id]);

        return $card->load('tags', 'members');
    }

    public function detachTag(Card $card, Tag $tag)
    {
        $card->tags()->detach($tag->id);

        return $card->load('tags', 'members');
    }

    public function assignMember(Card $card, Member $member)
    {
        $card->members()->syncWithoutDetaching([$member->id]);

        return $card->load('tags', 'members');
    }

    public function unassignMember(Card $card, Member $member)
    {
        $card->members()->detach($member->id);

        return $card->load('tags', 'members');
    }
}
