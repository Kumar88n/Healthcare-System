<?php

namespace App\Filament\Resources\DoctorsResource\Pages;

use App\Filament\Resources\DoctorsResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDoctors extends EditRecord
{
    protected static string $resource = DoctorsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),

        ];
    }
}
