<?php

namespace App\Filament\Resources\DoctorsResource\Pages;

use App\Filament\Resources\DoctorsResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Filament\Resources\Pages\ListRecords;
use App\Models\Doctors; 
use App\Models\User; 
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\TextInput;



class CreateDoctors extends CreateRecord
{
    protected static string $resource = DoctorsResource::class;


    // protected function mutateFormDataBeforeCreate(array $data): array
    // {
    //     $user = DoctorsResource::createUserFromDoctor($data);

    //     Doctors::create([
    //         'user_id' => $user->id,
    //         'name' => $data['name'],
    //     ]);

    //     return [];
    // }

    protected function getHeaderActions(): array
    {
        return [
            // Actions\Action::make('Add Additional Details') 
            // ->form([
            //     Grid::make(2)->schema([ 
            //         TextInput::make('name')
            //             ->required()
            //             ->label('Doctor Name'),

            //         TextInput::make('email')
            //             ->required()
            //             ->label('Email')
            //             ->email()
            //             ->unique(User::class, 'email'), 

            //         TextInput::make('password')
            //             ->required()
            //             ->label('Password')
            //             ->password()
            //             ->revealable(), 

            //         TextInput::make('role')
            //             ->default('doctor')
            //             ->readOnly(), 

            //         TextInput::make('approved_by_admin')
            //             ->default('1')
            //             ->readOnly(), 
            //     ])
            // ])
            // ->action(function (array $data) {
            //     $data['password'] = bcrypt($data['password']);
                
            //     User::create($data);
            // })
            // ->modalHeading('Additional Details') 
            // ->modalButton('Save'),
    ];
          
    }
}
