#define MyAppName "Tempe CLI"
#ifndef MyAppVersion
  #define MyAppVersion "1.0.0"
#endif

[Setup]
AppId={{AFC94BCE-2D53-4C5A-B6FD-A2A4A1116F31}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher=Razan Naufal
AppPublisherURL=https://github.com/razannnaufal/tempe-cli
DefaultDirName={localappdata}\Programs\Tempe
DefaultGroupName=Tempe CLI
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir=..\dist
OutputBaseFilename=Tempe-Setup-{#MyAppVersion}-windows-x64
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ChangesEnvironment=yes
UninstallDisplayIcon={app}\tempe.exe

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional shortcuts:"

[Files]
Source: "..\dist\tempe.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\Tempe CLI"; Filename: "{app}\tempe.exe"
Name: "{userdesktop}\Tempe CLI"; Filename: "{app}\tempe.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\tempe.exe"; Parameters: "--install-notify"; Description: "Launch Tempe CLI"; Flags: postinstall nowait skipifsilent

[Code]
function NormalizePathEntry(const Value: string): string;
begin
  Result := Trim(Value);
  while (Length(Result) > 3) and (Result[Length(Result)] = '\') do
    Delete(Result, Length(Result), 1);
end;

function UserPathContains(const PathValue, Entry: string): Boolean;
var
  Remaining, Current: string;
  Separator: Integer;
begin
  Result := False;
  Remaining := PathValue;
  while Remaining <> '' do
  begin
    Separator := Pos(';', Remaining);
    if Separator = 0 then
    begin
      Current := Trim(Remaining);
      Remaining := '';
    end
    else
    begin
      Current := Trim(Copy(Remaining, 1, Separator - 1));
      Delete(Remaining, 1, Separator);
    end;

    if CompareText(NormalizePathEntry(Current), NormalizePathEntry(Entry)) = 0 then
    begin
      Result := True;
      Exit;
    end;
  end;
end;

function RemoveUserPathEntry(const PathValue, Entry: string): string;
var
  Remaining, Current: string;
  Separator: Integer;
begin
  Result := '';
  Remaining := PathValue;
  while Remaining <> '' do
  begin
    Separator := Pos(';', Remaining);
    if Separator = 0 then
    begin
      Current := Trim(Remaining);
      Remaining := '';
    end
    else
    begin
      Current := Trim(Copy(Remaining, 1, Separator - 1));
      Delete(Remaining, 1, Separator);
    end;

    if (Current <> '') and
       (CompareText(NormalizePathEntry(Current), NormalizePathEntry(Entry)) <> 0) then
    begin
      if Result <> '' then
        Result := Result + ';';
      Result := Result + Current;
    end;
  end;
end;

procedure AddAppToUserPath;
var
  UserPath, AppDir: string;
begin
  AppDir := ExpandConstant('{app}');
  if not RegQueryStringValue(HKCU, 'Environment', 'Path', UserPath) then
    UserPath := '';

  if not UserPathContains(UserPath, AppDir) then
  begin
    if (UserPath <> '') and (UserPath[Length(UserPath)] <> ';') then
      UserPath := UserPath + ';';
    UserPath := UserPath + AppDir;
    if not RegWriteExpandStringValue(HKCU, 'Environment', 'Path', UserPath) then
      RaiseException('Could not add Tempe to your user PATH.');
  end;
end;

procedure RemoveAppFromUserPath;
var
  UserPath, UpdatedPath: string;
begin
  if RegQueryStringValue(HKCU, 'Environment', 'Path', UserPath) then
  begin
    UpdatedPath := RemoveUserPathEntry(UserPath, ExpandConstant('{app}'));
    if UpdatedPath <> UserPath then
      if not RegWriteExpandStringValue(HKCU, 'Environment', 'Path', UpdatedPath) then
        RaiseException('Could not remove Tempe from your user PATH.');
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
    AddAppToUserPath;
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin
  if CurUninstallStep = usUninstall then
    RemoveAppFromUserPath;
end;
