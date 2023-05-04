Set objWShell = CreateObject("Wscript.Shell")
Const OPT     = "Powershell -ExecutionPolicy Unrestricted -NoExit "
result        = objWShell.Run (OPT & "%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -File .\mainpc.ps1",0,true)

