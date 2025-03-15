<?php

namespace App\Filament\Resources\DocterApprovalResource\Pages;

use App\Filament\Resources\DocterApprovalResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use App\Models\User;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\TextInput;

class ListDocterApprovals extends ListRecords
{
    protected static string $resource = DocterApprovalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Actions\CreateAction::make(),

              Actions\Action::make('Add Doctor') 
                ->form([
                    Grid::make(2)->schema([ 
                        TextInput::make('name')
                            ->required()
                            ->label('Doctor Name'),

                        TextInput::make('email')
                            ->required()
                            ->label('Email')
                            ->email()
                            ->unique(User::class, 'email'), 

                        TextInput::make('password')
                            ->required()
                            ->label('Password')
                            ->password()
                            ->revealable(), 

                        TextInput::make('role')
                            ->default('doctor')
                            ->readOnly(), 

                        // TextInput::make('approved_by_admin')
                        //     ->default('1')
                        //     ->readOnly(), 
                    ])
                ])
                ->action(function (array $data) {
                    $data['password'] = bcrypt($data['password']);
                    User::create($data);
                })
                ->modalHeading('Doctor registration') 
                ->modalButton('Save'),
        ];
    }
}
