<?php

namespace App\Http\Controllers;

use App\Models\AgendaSession;
use App\Models\CongressResource;
use App\Models\Exhibitor;
use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;
use App\Models\Question;
use App\Models\Speaker;
use App\Models\User;
use App\Support\CongressPresenter;
use Illuminate\Http\Request;

class CongressController extends Controller
{
    public function __construct(private CongressPresenter $presenter) {}

    public function bootstrap(Request $request)
    {
        return response()->json($this->presenter->bootstrap($request->user()));
    }

    public function bookmark(Request $request, AgendaSession $session)
    {
        /** @var User $user */
        $user = $request->user();
        $user->bookmarkedSessions()->toggle($session->id);
        $session->load('day');
        $ids = $user->bookmarkedSessions()->pluck('agenda_sessions.id');

        return response()->json([
            'session' => $this->presenter->session($session, $ids),
            'user' => $this->presenter->user($user),
        ]);
    }

    public function favorite(Request $request, Speaker $speaker)
    {
        /** @var User $user */
        $user = $request->user();
        $user->favoriteSpeakers()->toggle($speaker->id);
        $ids = $user->favoriteSpeakers()->pluck('speakers.id');

        return response()->json([
            'speaker' => $this->presenter->speaker($speaker, $ids),
            'user' => $this->presenter->user($user),
        ]);
    }

    public function vote(Request $request, Poll $poll)
    {
        $data = $request->validate([
            'option_id' => ['required', 'integer'],
        ]);

        $option = PollOption::where('poll_id', $poll->id)->where('id', $data['option_id'])->first();
        if (! $option) {
            return response()->json(['message' => 'That choice is not on this poll.'], 422);
        }

        /** @var User $user */
        $user = $request->user();
        $existing = PollVote::where('user_id', $user->id)->where('poll_id', $poll->id)->first();

        if (! $existing || $existing->poll_option_id !== $option->id) {
            if ($existing) {
                PollOption::where('id', $existing->poll_option_id)->where('votes', '>', 0)->decrement('votes');
                $existing->update(['poll_option_id' => $option->id]);
            } else {
                PollVote::create([
                    'user_id' => $user->id,
                    'poll_id' => $poll->id,
                    'poll_option_id' => $option->id,
                ]);
            }
            $option->increment('votes');
        }

        $poll->load('options');

        return response()->json($this->presenter->poll($poll, $option->id));
    }

    public function storeQuestion(Request $request)
    {
        $data = $request->validate([
            'text' => ['required', 'string', 'max:500'],
            'topic' => ['required', 'string', 'max:40'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $question = Question::create([
            'user_id' => $user->id,
            'author_name' => $user->name,
            'topic' => $data['topic'],
            'status' => 'Open',
            'votes' => 1,
            'body' => $data['text'],
            'bucket' => 'Recent',
            'sort' => 0,
        ]);
        \Illuminate\Support\Facades\DB::table('question_upvotes')->insert([
            'user_id' => $user->id,
            'question_id' => $question->id,
        ]);

        return response()->json($this->presenter->question($question, $user->id), 201);
    }

    public function upvote(Request $request, Question $question)
    {
        /** @var User $user */
        $user = $request->user();
        $already = \Illuminate\Support\Facades\DB::table('question_upvotes')
            ->where('user_id', $user->id)
            ->where('question_id', $question->id)
            ->exists();

        if (! $already) {
            \Illuminate\Support\Facades\DB::table('question_upvotes')->insert([
                'user_id' => $user->id,
                'question_id' => $question->id,
            ]);
            $question->increment('votes');
            $question->refresh();
        }

        return response()->json($this->presenter->question($question, $user->id));
    }

    public function saveResource(Request $request, CongressResource $resource)
    {
        /** @var User $user */
        $user = $request->user();
        $user->savedResources()->toggle($resource->id);
        $ids = $user->savedResources()->pluck('congress_resources.id');

        return response()->json([
            'resource' => $this->presenter->resource($resource, $ids),
            'user' => $this->presenter->user($user),
        ]);
    }

    public function saveExhibitor(Request $request, Exhibitor $exhibitor)
    {
        /** @var User $user */
        $user = $request->user();
        $user->savedExhibitors()->toggle($exhibitor->id);
        $ids = $user->savedExhibitors()->pluck('exhibitors.id');

        return response()->json([
            'exhibitor' => $this->presenter->exhibitor($exhibitor, $ids),
            'user' => $this->presenter->user($user),
        ]);
    }
}
