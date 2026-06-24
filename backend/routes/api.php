<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardListController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::apiResource('boards', BoardController::class);
Route::apiResource('tags', TagController::class);
Route::apiResource('members', MemberController::class);
Route::apiResource('boards.lists', BoardListController::class);
Route::apiResource('cards', CardController::class);

Route::put('/cards/{card}/move', [CardController::class, 'move']);
Route::post('/cards/{card}/tags/{tag}', [CardController::class, 'attachTag']);
Route::delete('/cards/{card}/tags/{tag}', [CardController::class, 'detachTag']);
Route::post('/cards/{card}/members/{member}', [CardController::class, 'assignMember']);
Route::delete('/cards/{card}/members/{member}', [CardController::class, 'unassignMember']);
