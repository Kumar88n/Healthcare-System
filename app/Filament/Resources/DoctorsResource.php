<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DoctorsResource\Pages;
use App\Models\Doctors;
use Filament\Forms\Form;
use Filament\Tables;
use Filament\Resources\Resource;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Get;
use Closure;
use Carbon\Carbon;


class DoctorsResource extends Resource
{
    protected static ?string $navigationGroup = 'Doctors Management';
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $pluralLabel = 'Doctors';
    protected static ?string $model = Doctors::class;
    protected static ?string $navigationLabel = 'Doctors';
    protected static ?string $slug = 'doctors';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(3)->schema([
                TextInput::make('name')->required()->default(fn($record) => $record->name),
                TextInput::make('department')->required()->default(fn($record) => $record->department),
                TextInput::make('specialty')->required()->default(fn($record) => $record->specialty),
                Toggle::make('emergency_available')
                    ->required()
                    ->default(fn($record) => (bool) $record->emergency_available)
                    ->live(),
            ]),

            Section::make('Regular Appointment')
                ->description('')
                ->schema([
                    Grid::make(1)
                        ->schema([
                            TextInput::make('fee')
                                ->label('Regular Fee')
                                ->required()
                                ->default(fn($record) => $record->fee),
                        ]),

                    Repeater::make('availability')
                        ->schema([
                            Grid::make(3)
                                ->schema([
                                    Select::make('day')
                                        ->label('Day')
                                        ->options(fn(callable $get) => array_diff(self::getWeekDays(), array_column($get('../../availability') ?? [], 'day')))
                                        ->required()
                                        ->reactive(),

                                    TimePicker::make('start_at')
                                        ->label('Start Time')
                                        ->displayFormat('H:i')
                                        ->datalist(self::getTimeSlots())
                                        ->required(),

                                    TimePicker::make('end_at')
                                        ->label('End Time')
                                        ->displayFormat('H:i')
                                        ->datalist(self::getTimeSlots())
                                        ->required()
                                        ->after('start_at'),
                                ]),
                        ])
                        ->default(fn($record) => is_array($record->availability) ? $record->availability : [])
                        ->collapsible(),
                ]),

            Section::make('Emergency Appointment')
                ->description('')
                ->schema([
                    Grid::make(1)
                        ->schema([
                            TextInput::make('emergency_fee')
                                ->label('Emergency Fee')
                                ->required()
                                ->default(fn($record) => $record->emergency_fee),
                        ]),

                    Repeater::make('emergency_schedule')
                        ->schema([
                            Grid::make(3)
                                ->schema([
                                    Select::make('day')
                                        ->label('Day')
                                        ->options(
                                            fn(callable $get) =>
                                            array_diff(self::getWeekDays(), array_map(fn($entry) => $entry['day'], $get('availability') ?? []))
                                        )
                                        ->required()
                                        ->reactive(),

                                    TimePicker::make('start_at')
                                        ->label('Start Time')
                                        ->displayFormat('H:i')
                                        ->datalist(self::getTimeSlots())
                                        ->required(),

                                    TimePicker::make('end_at')
                                        ->label('End Time')
                                        ->displayFormat('H:i')
                                        ->datalist(self::getTimeSlots())
                                        ->required()
                                        ->after('start_at'),
                                ]),
                        ])
                        ->default(fn($record) => is_array($record->emergency_schedule) ? $record->emergency_schedule : [])
                        ->collapsible(),
                ])
                ->hidden(fn(Get $get): bool => $get('emergency_available') !== true),

        ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Name')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('specialty')->label('Specialty')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('department')->label('Department')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('fee')->label('Fee')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('availability')
                    ->label('Regular Appointment')
                    ->sortable()
                    ->searchable()
                    ->formatStateUsing(function ($state) {
                        if (empty($state)) {
                            return 'No schedule set';
                        }

                        if (is_string($state)) {
                            $jsonDecoded = json_decode($state, true);
                            if (json_last_error() === JSON_ERROR_NONE) {
                                $state = $jsonDecoded;
                            } else if (@unserialize($state) !== false) {
                                $state = unserialize($state);
                            }
                        }

                        if (!is_array($state)) {
                            return 'Format error: ' . substr(json_encode($state), 0, 50);
                        }

                        $parts = [];
                        foreach ($state as $day => $timeSlots) {
                            if (empty($day) || empty($timeSlots)) {
                                continue;
                            }

                            if (is_array($timeSlots)) {
                                $formattedSlots = implode(', ', $timeSlots);
                            } else {
                                $formattedSlots = (string)$timeSlots;
                            }
                            $parts[] = ucfirst($day) . ': ' . $formattedSlots;
                        }
                        return !empty($parts) ? implode(' | ', $parts) : 'No time slots defined';
                    }),

                Tables\Columns\ToggleColumn::make('emergency_available'),
                Tables\Columns\TextColumn::make('emergency_fee')->label('Emergency Fee')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('emergency_schedule')->label('Emergency Schedule')
                    ->sortable()
                    ->formatStateUsing(function ($state) {
                        if (empty($state)) {
                            return 'No schedule set';
                        }

                        $scheduleData = $state;

                        if (is_string($state) && !is_array($state)) {
                            $decoded = json_decode($state, true);
                            if (json_last_error() === JSON_ERROR_NONE) {
                                $scheduleData = $decoded;
                            }
                        }

                        if (!is_array($scheduleData)) {
                            return 'Invalid Data';
                        }

                        return collect($scheduleData)
                            ->map(function ($timeRanges, $day) {
                                if (empty($timeRanges)) {
                                    return null;
                                }

                                return ucfirst($day) . ': ' . implode(', ', (array)$timeRanges);
                            })
                            ->filter()
                            ->implode(' | ');
                    })
                    ->wrap()
                    ->searchable(),

                Tables\Columns\TextColumn::make('created_at')->label('Created At')->sortable()->dateTime()->hidden(),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([

                Tables\Actions\Action::make('editDoctor')
                    ->label('Edit Doctor')
                    ->modalHeading('Edit Doctor')
                    ->form(fn($record) => [
                        Grid::make(2)
                            ->schema([
                                Grid::make(3)->schema([
                                    TextInput::make('name')->required()->default(fn($record) => $record->name),
                                    TextInput::make('department')->required()->default(fn($record) => $record->department),
                                    TextInput::make('specialty')->required()->default(fn($record) => $record->specialty),
                                    Toggle::make('emergency_available')
                                        ->required()
                                        ->default(fn($record) => (bool) $record->emergency_available)
                                        ->live(),
                                ]),

                                Section::make('Regular Appointment')
                                    ->description('')
                                    ->schema([
                                        Grid::make(1)
                                            ->schema([
                                                TextInput::make('fee')
                                                    ->label('Regular Fee')
                                                    ->required()
                                                    ->default(fn($record) => $record->fee),
                                            ]),

                                        Repeater::make('availability')
                                            ->label('Regular Schedule')
                                            ->schema([
                                                Grid::make(3)
                                                    ->schema([
                                                        Select::make('day')
                                                            ->label('Day')
                                                            ->options(fn(callable $get) => array_diff(self::getWeekDays(), array_column($get('availability') ?? [], 'day')))
                                                            ->required()
                                                            ->reactive(),

                                                        TimePicker::make('start_at')
                                                            ->label('Start Time')
                                                            ->displayFormat('H:i')
                                                            ->datalist(self::getTimeSlots())
                                                            ->required(),

                                                        TimePicker::make('end_at')
                                                            ->label('End Time')
                                                            ->displayFormat('H:i')
                                                            ->datalist(self::getTimeSlots())
                                                            ->required()
                                                            ->after('start_at'),
                                                    ]),
                                            ])

                                            ->default(function ($record) {
                                                if (empty($record->availability)) {
                                                    return [];
                                                }
                                            
                                                $result = [];
                                            
                                                foreach ($record->availability as $dayData) {
                                                    foreach ($dayData as $day => $timeRanges) {
                                                        foreach ($timeRanges as $timeRange) {
                                                            [$startTime, $endTime] = explode('-', $timeRange);
                                                            $result[] = [
                                                                'day' => $day,
                                                                'start_at' => \Carbon\Carbon::parse(trim($startTime))->format('H:i'),
                                                                'end_at' => \Carbon\Carbon::parse(trim($endTime))->format('H:i'),
                                                            ];
                                                        }
                                                    }
                                                }
                                            
                                                return $result;
                                            })
                                            ->collapsible()
                                            ->rules([
                                                function (callable $get) {
                                                    return function (string $attribute, $value, Closure $fail) use ($get) {
                                                        $availability = $get('availability') ?? [];
                                                        $existingSchedules = [];

                                                        foreach ($availability as $index => $entry) {
                                                            $day = $entry['day'] ?? null;
                                                            $start = $entry['start_at'] ?? null;
                                                            $end = $entry['end_at'] ?? null;

                                                            if ($day && $start && $end) {
                                                                $currentTimeRange = [$start, $end];

                                                                if (!isset($existingSchedules[$day])) {
                                                                    $existingSchedules[$day] = [];
                                                                }

                                                                foreach ($existingSchedules[$day] as $prevRange) {
                                                                    if (
                                                                        ($start >= $prevRange[0] && $start < $prevRange[1]) ||
                                                                        ($end > $prevRange[0] && $end <= $prevRange[1]) ||
                                                                        ($start <= $prevRange[0] && $end >= $prevRange[1])
                                                                    ) {
                                                                        $fail("Time slot on $day overlaps with another entry.");
                                                                        return;
                                                                    }
                                                                }

                                                                $existingSchedules[$day][] = $currentTimeRange;
                                                            }
                                                        }
                                                    };
                                                }
                                            ]),

                                    ])

                                    ->columnSpan(1),

                                Section::make('Emergency Appointment')
                                    ->description('')
                                    ->schema([
                                        Grid::make(1)
                                            ->schema([
                                                TextInput::make('emergency_fee')
                                                    ->label('Emergency Fee')
                                                    ->required()
                                                    ->default(fn($record) => $record->emergency_fee),
                                            ]),

                                        Repeater::make('emergency_schedule')
                                            ->label('Emergency Schedule')
                                            ->schema([
                                                Grid::make(3)
                                                    ->schema([
                                                        Select::make('day')
                                                            ->label('Day')
                                                            ->options(
                                                                fn(callable $get) =>
                                                                array_diff(self::getWeekDays(), array_map(fn($entry) => $entry['day'], $get('availability') ?? []))
                                                            )
                                                            ->required()
                                                            ->reactive(),

                                                        TimePicker::make('start_at')
                                                            ->label('Start Time')
                                                            ->displayFormat('H:i')
                                                            ->datalist(self::getTimeSlots())
                                                            ->required(),

                                                        TimePicker::make('end_at')
                                                            ->label('End Time')
                                                            ->displayFormat('H:i')
                                                            ->datalist(self::getTimeSlots())
                                                            ->required()
                                                            ->after('start_at'),
                                                    ]),
                                            ])
                                                                            
                                            ->default(function ($record) {
                                                if (empty($record->emergency_schedule)) {
                                                    return [];
                                                }
                                            
                                                $result = [];
                                            
                                                foreach ($record->emergency_schedule as $dayData) {
                                                    foreach ($dayData as $day => $timeRanges) {
                                                        foreach ($timeRanges as $timeRange) {
                                                            [$startTime, $endTime] = explode('-', $timeRange);
                                                            $result[] = [
                                                                'day' => $day,
                                                                'start_at' => \Carbon\Carbon::parse(trim($startTime))->format('H:i'),
                                                                'end_at' => \Carbon\Carbon::parse(trim($endTime))->format('H:i'),
                                                            ];
                                                        }
                                                    }
                                                }
                                            
                                                return $result;
                                            })
                                            ->collapsible()
                                            ->rules([
                                                function (callable $get) {
                                                    return function (string $attribute, $value, Closure $fail) use ($get) {
                                                        $emergency_schedule = $get('emergency_schedule') ?? [];
                                                        $existingEmergency = [];

                                                        foreach ($emergency_schedule as $index => $entry) {
                                                            $day = $entry['day'] ?? null;
                                                            $start = $entry['start_at'] ?? null;
                                                            $end = $entry['end_at'] ?? null;

                                                            if ($day && $start && $end) {
                                                                $currentTimeRange = [$start, $end];

                                                                if (!isset($existingEmergency[$day])) {
                                                                    $existingEmergency[$day] = [];
                                                                }

                                                                foreach ($existingEmergency[$day] as $prevRange) {
                                                                    if (
                                                                        ($start >= $prevRange[0] && $start < $prevRange[1]) ||
                                                                        ($end > $prevRange[0] && $end <= $prevRange[1]) ||
                                                                        ($start <= $prevRange[0] && $end >= $prevRange[1])
                                                                    ) {
                                                                        $fail("Time slot on $day overlaps with another entry.");
                                                                        return;
                                                                    }
                                                                }

                                                                $existingEmergency[$day][] = $currentTimeRange;
                                                            }
                                                        }
                                                    };
                                                }
                                            ]),
                                    ])
                                    ->columnSpan(1)
                                    ->hidden(fn(Get $get): bool => !$get('emergency_available')),
                            ]),
                    ])
                    ->action(function ($record, $data) {
                        // First format availability and emergency schedule
                        $formattedAvailability = collect($data['availability'] ?? [])
                            ->groupBy('day')
                            ->mapWithKeys(fn($items, $day) => [
                                $day => $items->map(
                                    fn($item) =>
                                    Carbon::parse($item['start_at'])->format('h:i A') . '-' . Carbon::parse($item['end_at'])->format('h:i A')
                                )->toArray()
                            ])
                            ->toArray();

                        $formattedEmergencySchedule = collect($data['emergency_schedule'] ?? [])
                            ->groupBy('day')
                            ->mapWithKeys(fn($items, $day) => [
                                $day => $items->map(
                                    fn($item) =>
                                    Carbon::parse($item['start_at'])->format('h:i A') . '-' . Carbon::parse($item['end_at'])->format('h:i A')
                                )->toArray()
                            ])
                            ->toArray();

                        $record->update([
                            ...$data,
                            'availability' => [$formattedAvailability],
                            'emergency_schedule' => [$formattedEmergencySchedule],
                        ]);
                    }),


                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    private static function getTimeSlots(): array
    {
        return [
            '09:00',
            '09:15',
            '09:30',
            '09:45',
            '10:00',
            '10:15',
            '10:30',
            '10:45',
            '11:00',
            '11:15',
            '11:30',
            '11:45',
            '12:00',
            '12:15',
            '12:30',
            '12:45',
            '13:00',
            '13:15',
            '13:30',
            '13:45',
            '14:00',
            '14:15',
            '14:30',
            '14:45',
            '15:00',
            '15:15',
            '15:30',
            '15:45',
            '16:00',
            '16:15',
            '16:30',
            '16:45',
            '17:00',
        ];
    }
    // private static function getTimeSlots(): array
    // {
    //     return [
    //         '09:00 AM',
    //         '09:15 AM',
    //         '09:30 AM',
    //         '09:45 AM',
    //         '10:00 AM',
    //         '10:15 AM',
    //         '10:30 AM',
    //         '10:45 AM',
    //         '11:00 AM',
    //         '11:15 AM',
    //         '11:30 AM',
    //         '11:45 AM',
    //         '12:00 PM',
    //         '12:15 PM',
    //         '12:30 PM',
    //         '12:45 PM',
    //         '01:00 PM',
    //         '01:15 PM',
    //         '01:30 PM',
    //         '01:45 PM',
    //         '02:00 PM',
    //         '02:15 PM',
    //         '02:30 PM',
    //         '02:45 PM',
    //         '03:00 PM',
    //         '03:15 PM',
    //         '03:30 PM',
    //         '03:45 PM',
    //         '04:00 PM',
    //         '04:15 PM',
    //         '04:30 PM',
    //         '04:45 PM',
    //         '05:00 PM',
    //     ];
    // }


    private static function getWeekDays(): array
    {
        return [
            'Mon' => 'Mon',
            'Tue' => 'Tue',
            'Wed' => 'Wed',
            'Thu' => 'Thu',
            'Fri' => 'Fri',
            'Sat' => 'Sat',
            'Sun' => 'Sun',
        ];
    }


    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDoctors::route('/'),
            'create' => Pages\CreateDoctors::route('/create'),
            'edit' => Pages\EditDoctors::route('/{record}/edit'),
        ];
    }
}
