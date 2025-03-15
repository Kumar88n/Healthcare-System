<?php

namespace App\Filament\Resources\DocterApprovalResource\Pages;

use App\Filament\Resources\DocterApprovalResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDocterApproval extends EditRecord
{
    protected static string $resource = DocterApprovalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
