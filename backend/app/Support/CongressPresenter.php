<?php

namespace App\Support;

use App\Models\AgendaSession;
use App\Models\CongressEvent;
use App\Models\CongressNotification;
use App\Models\CongressResource;
use App\Models\Exhibitor;
use App\Models\Poll;
use App\Models\Question;
use App\Models\Speaker;
use App\Models\Tool;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Support\Collection;

class CongressPresenter
{
    public function user(User $user): array
    {
        $saved = str_pad((string) $user->savedTotal(), 2, '0', STR_PAD_LEFT);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'organization' => $user->organization,
            'phone' => $user->phone,
            'location' => $user->location,
            'badge_id' => $user->badge_id,
            'role' => $user->role_title,
            'badge_role' => $user->badge_role,
            'initials' => $user->initials,
            'stats' => [
                ['icon' => 'calendar-outline', 'value' => str_pad((string) $user->sessions_count, 2, '0', STR_PAD_LEFT), 'label' => 'Sessions'],
                ['icon' => 'bookmark-outline', 'value' => $saved, 'label' => 'Saved'],
                ['icon' => 'ribbon-outline', 'value' => str_pad((string) $user->certificates_count, 2, '0', STR_PAD_LEFT), 'label' => 'Certificates'],
            ],
        ];
    }

    public function event(?CongressEvent $event): ?array
    {
        if (! $event) {
            return null;
        }

        return [
            'kicker' => $event->kicker,
            'title' => $event->title,
            'meta' => $event->meta,
            'date_short' => $event->date_short,
        ];
    }

    public function notification(?CongressNotification $notification): ?array
    {
        if (! $notification) {
            return null;
        }

        return [
            'title' => $notification->title,
            'body' => $notification->body,
        ];
    }

    public function tool(Tool $tool): array
    {
        return [
            'id' => $tool->slug,
            'title' => $tool->title,
            'description' => $tool->description,
            'category' => $tool->category,
            'icon' => $tool->icon,
        ];
    }

    public function session(AgendaSession $session, Collection $bookmarkedIds): array
    {
        return [
            'id' => $session->id,
            'day' => $session->day?->code,
            'time' => $session->time,
            'period' => $session->period,
            'tag' => $session->tag,
            'title' => $session->title,
            'meta' => $session->meta,
            'bookmarked' => $bookmarkedIds->contains($session->id),
        ];
    }

    public function speaker(Speaker $speaker, Collection $starredIds): array
    {
        return [
            'id' => $speaker->id,
            'name' => $speaker->name,
            'role' => $speaker->role,
            'place' => $speaker->place,
            'talk' => $speaker->talk,
            'field' => $speaker->field,
            'initials' => $speaker->initials,
            'featured' => $speaker->featured,
            'colors' => [$speaker->color_start, $speaker->color_end],
            'bio' => $speaker->bio,
            'starred' => $starredIds->contains($speaker->id),
        ];
    }

    public function venue(?Venue $venue): ?array
    {
        if (! $venue) {
            return null;
        }

        return [
            'name' => $venue->name,
            'date' => $venue->date_label,
            'address' => $venue->address,
            'latitude' => (float) $venue->latitude,
            'longitude' => (float) $venue->longitude,
            'facilities' => $venue->facilities->map(fn ($facility) => [
                'id' => $facility->id,
                'label' => $facility->label,
                'icon' => $facility->icon,
            ])->values(),
        ];
    }

    public function poll(Poll $poll, ?int $selectedOptionId): array
    {
        $total = (int) $poll->options->sum('votes');

        return [
            'id' => $poll->id,
            'tag' => $poll->tag,
            'question' => $poll->question,
            'total' => $total,
            'selected_option_id' => $selectedOptionId,
            'options' => $poll->options->map(function ($option) use ($total) {
                $percent = $total > 0 ? (int) round(($option->votes / $total) * 100) : 0;

                return [
                    'id' => $option->id,
                    'label' => $option->label,
                    'votes' => $option->votes,
                    'percent' => $percent,
                ];
            })->values(),
        ];
    }

    public function question(Question $question, int $userId, ?Collection $upvotedIds = null): array
    {
        $upvoted = $upvotedIds
            ? $upvotedIds->contains($question->id)
            : \Illuminate\Support\Facades\DB::table('question_upvotes')
                ->where('user_id', $userId)
                ->where('question_id', $question->id)
                ->exists();

        return [
            'id' => $question->id,
            'topic' => $question->topic,
            'status' => $question->status,
            'votes' => $question->votes,
            'text' => $question->body,
            'author' => $question->author_name,
            'bucket' => $question->bucket,
            'mine' => (int) $question->user_id === $userId,
            'upvoted' => $upvoted,
        ];
    }

    public function resource(CongressResource $resource, Collection $savedIds): array
    {
        return [
            'id' => $resource->id,
            'kind' => $resource->kind,
            'title' => $resource->title,
            'detail' => $resource->detail,
            'size' => $resource->size,
            'icon' => $resource->icon,
            'tint' => $resource->tint,
            'saved' => $savedIds->contains($resource->id),
        ];
    }

    public function exhibitor(Exhibitor $exhibitor, Collection $savedIds): array
    {
        return [
            'id' => $exhibitor->id,
            'name' => $exhibitor->name,
            'booth' => $exhibitor->booth,
            'focus' => $exhibitor->focus,
            'saved' => $savedIds->contains($exhibitor->id),
        ];
    }

    public function bootstrap(User $user): array
    {
        $user->load([
            'bookmarkedSessions:id',
            'favoriteSpeakers:id',
            'savedResources:id',
            'savedExhibitors:id',
            'pollVotes',
        ]);

        $bookmarked = $user->bookmarkedSessions->pluck('id');
        $starred = $user->favoriteSpeakers->pluck('id');
        $savedResources = $user->savedResources->pluck('id');
        $savedExhibitors = $user->savedExhibitors->pluck('id');
        $votes = $user->pollVotes->keyBy('poll_id');
        $upvoted = \Illuminate\Support\Facades\DB::table('question_upvotes')->where('user_id', $user->id)->pluck('question_id')->map(fn ($id) => (int) $id);

        $sessions = AgendaSession::with('day')->orderBy('sort')->get();
        $polls = Poll::with('options')->orderBy('sort')->get();

        return [
            'event' => $this->event(CongressEvent::query()->first()),
            'notification' => $this->notification(CongressNotification::query()->first()),
            'tools' => Tool::query()->orderBy('sort')->get()->map(fn (Tool $tool) => $this->tool($tool))->values(),
            'days' => \App\Models\CongressDay::query()->orderBy('sort')->get()->map(fn ($day) => [
                'id' => $day->code,
                'label' => $day->label,
                'date' => $day->date_label,
                'heading' => $day->heading,
                'sub' => $day->subtitle,
            ])->values(),
            'sessions' => $sessions->map(fn (AgendaSession $session) => $this->session($session, $bookmarked))->values(),
            'speakers' => Speaker::query()->orderBy('sort')->get()->map(fn (Speaker $speaker) => $this->speaker($speaker, $starred))->values(),
            'venue' => $this->venue(Venue::with('facilities')->first()),
            'polls' => $polls->map(fn (Poll $poll) => $this->poll($poll, $votes->get($poll->id)?->poll_option_id))->values(),
            'questions' => Question::query()->orderByDesc('votes')->orderByDesc('id')->get()->map(fn (Question $question) => $this->question($question, $user->id, $upvoted))->values(),
            'resources' => CongressResource::query()->orderBy('sort')->get()->map(fn (CongressResource $resource) => $this->resource($resource, $savedResources))->values(),
            'exhibitors' => Exhibitor::query()->orderBy('sort')->get()->map(fn (Exhibitor $exhibitor) => $this->exhibitor($exhibitor, $savedExhibitors))->values(),
        ];
    }
}
