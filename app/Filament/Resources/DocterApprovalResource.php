<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DocterApprovalResource\Pages;
use App\Filament\Resources\DocterApprovalResource\RelationManagers;
use App\Models\Doctors;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Tables\Columns\TextColumn;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Columns\CheckboxColumn;
use Filament\Forms\Components\TextInput;


class DocterApprovalResource extends Resource
{
    protected static ?string $navigationGroup = 'Doctors Management'; 
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationLabel = 'Register Doctor'; 
    protected static ?string $pluralLabel = 'Register Doctor'; 
    protected static ?string $slug = 'register_doctor'; 

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()->where('role', 'doctor');  
    }

     public static function form(Form $form): Form
    {
        return $form
            ->schema([
            //     TextInput::make('name')
            //     ->label('Doctor Name')
            //     ->required()
            //     ->rules(['string', 'max:255']),  
            
            // TextInput::make('email')
            //     ->label('Email')
            //     ->required()
            //     ->email()
            //     ->rules(['email', 'max:255', 'unique:users,email']),  
            
            // TextInput::make('password')
            //     ->label('Password')
            //     ->password()
            //     ->revealable()
            //     ->required()
            //     ->rules(['string', 'min:8']),  
            
            // TextInput::make('role')
            //     ->label('Role')
            //     ->default('doctor')
            //     ->required()
            //     ->rules(['in:doctor,admin']),  
            

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
        ->columns([
            Tables\Columns\TextColumn::make('name')->label('Name')->sortable()->searchable(),
            Tables\Columns\TextColumn::make('email')->label('Email')->sortable()->searchable(),
            Tables\Columns\CheckboxColumn::make('approved_by_admin')
            ->label('Approve')
            ->sortable()
            ->afterStateUpdated(function (User $record, $state) {
                if ($state) { 
                    if (!Doctors::where('user_id', $record->id)->exists()) {
                        Doctors::create([
                            'user_id' => $record->id,  
                            'name' => $record->name, 
                            'specialization' => 'General',
                        ]);
                    }
                } else {
                    Doctors::where('user_id', $record->id)->delete();
                }
            }),

        ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\DeleteAction::make(),
            ])->recordUrl(null)

            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDocterApprovals::route('/'),
            'create' => Pages\CreateDocterApproval::route('/create'),
            'edit' => Pages\EditDocterApproval::route('/{record}/edit'),
        ];
    }
}

