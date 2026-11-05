<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'organization',
        'phone',
        'location',
        'badge_id',
        'role_title',
        'badge_role',
        'initials',
        'sessions_count',
        'certificates_count',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public static function initialsFrom(string $name): string
    {
        $parts = preg_split('/\s+/', trim(str_replace('.', '', $name))) ?: [];
        $parts = array_values(array_filter($parts));
        if (count($parts) === 0) {
            return 'NA';
        }
        if (count($parts) === 1) {
            return strtoupper(substr($parts[0], 0, 2));
        }

        return strtoupper(substr($parts[0], 0, 1).substr($parts[count($parts) - 1], 0, 1));
    }

    public function bookmarkedSessions(): BelongsToMany
    {
        return $this->belongsToMany(AgendaSession::class, 'agenda_bookmarks');
    }

    public function favoriteSpeakers(): BelongsToMany
    {
        return $this->belongsToMany(Speaker::class, 'speaker_favorites');
    }

    public function savedResources(): BelongsToMany
    {
        return $this->belongsToMany(CongressResource::class, 'resource_saves');
    }

    public function savedExhibitors(): BelongsToMany
    {
        return $this->belongsToMany(Exhibitor::class, 'exhibitor_saves');
    }

    public function pollVotes(): HasMany
    {
        return $this->hasMany(PollVote::class);
    }

    public function savedTotal(): int
    {
        return $this->bookmarkedSessions()->count()
            + $this->favoriteSpeakers()->count()
            + $this->savedResources()->count()
            + $this->savedExhibitors()->count();
    }
}
