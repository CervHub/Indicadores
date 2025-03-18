<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'doi',
        'email',
        'password',
        'nombres',
        'apellidos',
        'telefono',
        'codigo',
        'cargo',
        'entity_id',
        'company_id',
        'role_id',
        'new_company_id',
        'permisos',
        'system_role_id',
        'contrata',
        'text_password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // New Methods

    public function data()
    {
        // Obtener la entidad, la compañía y el rol

        $entity = $this->entity()->first();
        $company = $this->company()->first();
        $role = $this->role()->first();

        // Construir los datos a devolver
        $result = [
            'id' => $this->id,
            'doi' => $this->doi,
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos,
            'telefono' => $this->telefono,
            'codigo' => $this->codigo,
            'cargo' => $this->cargo,
            'entity' => $entity ? $entity->nombre : null,
            'id_company' => $this->company_id,
            'company' => $company ? $company->nombre : null,
            'role' => $role ? $role->nombre : null,
        ];

        return $result;
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function entity()
    {
        return $this->belongsTo(Entity::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
