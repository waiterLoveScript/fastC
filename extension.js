const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {

  // TODO: 下载zip
    
  const disposable = vscode.commands.registerCommand('install', async () => {
    
    const batPath = path.join(context.extensionPath, 'path', 'path.bat');

    const configFolderPath = path.join(context.extensionPath, 'config', '.vscode');
    //const destnPath = './.vscode';
    const destnPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode');;
    console.log(destnPath);

    const extensionId = 'ms-vscode.cpptools';
    const extensionUrl = `vscode:extension/${extensionId}`;

    const terminal = vscode.window.createTerminal({
      shellPath: 'powershell.exe'
    });

    await terminal.sendText('Remove-Item -Path "mingw.zip" -Force -ErrorAction SilentlyContinue');
    await terminal.sendText('Invoke-WebRequest -Uri "https://github.com/waiterLoveScript/fastC/archive/refs/heads/master.zip" -OutFile "mingw.zip"');

    await terminal.sendText('Remove-Item -Path "C:/MinGW" -Force -Recurse -ErrorAction SilentlyContinue');
    await terminal.sendText('Expand-Archive -Path "mingw.zip" -DestinationPath "C:/MinGW"');

    await terminal.sendText('Remove-Item -Path "mingw.zip" -Force -ErrorAction SilentlyContinue');

    await terminal.sendText(`${batPath}`);

    if(!fs.existsSync(destnPath))
    {
      fs.mkdirSync(destnPath, { recursive: true });
    }

    function copyFolder(src, dest)
    {
      fs.readdirSync(src).forEach((item) => {
        const sourceItemPath = path.join(src, item);
        const destinationItemPath = path.join(dest, item);
        if (fs.lstatSync(sourceItemPath).isDirectory()) {
          fs.mkdirSync(destinationItemPath);
          copyFolder(sourceItemPath, destinationItemPath);
        } else {
          fs.copyFileSync(sourceItemPath, destinationItemPath);
        }
       });
    }

    copyFolder(configFolderPath, destnPath);

    vscode.env.openExternal(vscode.Uri.parse(extensionUrl));

  })

  context.subscriptions.push(disposable);

}

function deactivate() {}

module.exports = { activate, deactivate }