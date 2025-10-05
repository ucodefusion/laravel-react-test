<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'room.view',
            'room.create',
            'room.update',
            'room.delete',
            'booking.create',
            'booking.update.own',
            'booking.cancel.own',
            'booking.manage.any',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $roles = [
            'admin' => $permissions,
            'staff' => [
                'room.view',
                'booking.create',
                'booking.update.own',
                'booking.cancel.own',
            ],
            'member' => [
                'room.view',
                'booking.create',
                'booking.update.own',
                'booking.cancel.own',
            ],
        ];

        foreach ($roles as $roleName => $perms) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($perms);
        }
    }
}
