<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public $apiValid;
    public $apiMessage;
    public $apiData;

    public function __construct()
    {
        $this->apiValid = false;
        $this->apiMessage = "";
        $this->apiData = [];
    }
}
