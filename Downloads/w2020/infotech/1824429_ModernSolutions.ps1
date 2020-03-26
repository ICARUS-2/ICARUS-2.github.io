#[string]$processName = "notepad"
#[string]$filePath = "F:\Winter 2020\Information Technology\Assignment 3\test-textfiles"
$PSDefaultParameterValues = @{"Bamboozle:filePath"="Get-Location"}
#KillThatProcess $processName
#Bamboozle $filePath

function KillThatProcess ([string]$processName)
{
    $numOfProcesses = (Get-Process -Name $processName).Count
    Write-Host('There are {0} processes with the name {1}' -f $numOfProcesses, $processName)


    $input = Read-Host -Prompt "Proceed? (Y/N)"
    $input = "$input".ToLower()


    If ($input -eq "y")
    {
        Write-Host "You have chosen to proceed, closing processes..." -ForegroundColor Green
        kill -Name $processName 
    }
    Else
    {
        Write-Host "You have chosen not to proceed" -ForegroundColor Red
    }
}

function Bamboozle  
{
    Param([string]$filePath)
    
    [int] $minLetter = 097 #ASCII range for number generated
    [int] $maxLetter = 122
    [char] $randomLetter

    $randomAscii = Get-Random -Minimum $minLetter -Maximum $maxLetter
    $randomLetter = [char]$randomAscii
    Write-Host "SIRRRRRRRRRRRRRRRRRRRR THE LETTER YOU REQUESTED IS $randomLetter SIRRRRRRRRRRRRRRRRRRRR (lol who is ivan again)" -BackgroundColor Yellow -ForegroundColor Red 
    $fileArray = @(Get-ChildItem -Path $filePath\* -Include *.txt)


    ForEach($file In $fileArray)
    {
        $content = Get-Content -Path $file
        If($content -match $randomLetter)
        {
            Remove-Item -Path $file -WhatIf
        }

    }

}