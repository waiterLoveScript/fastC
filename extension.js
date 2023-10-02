const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');
//const https = require('https');

async function activate(context) {
  const userHome = os.homedir();
  const configFolderPath = path.join(userHome, 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'lovescript.fastc');
  if(!fs.existsSync(path.join(configFolderPath, 'a.txt')))
  {
    fs.mkdirSync(configFolderPath, { recursive: true });
    fs.writeFileSync(path.join(configFolderPath, 'a.txt'), 'false', 'utf-8');
    const choice = await vscode.window.showInformationMessage(
      '是否立即配置C/C++环境？您也可以后续在命令面板中使用"一键配置C/C++"来配置',
      'Yes',
      'No');
    if(choice === 'Yes')
    {
      vscode.commands.executeCommand('install');
    }
  }

  // TODO: 下载zip
  //const fileUrl = 'https://waiterlovescript.github.io/resources/mingw64.zip';
  /*const fileUrl = 'https://raw.githubusercontent.com/waiterlovescript/waiterlovescript.github.io/main/resources/mingw64.zip';
  const fileName = 'mingw64.zip';
  const outputFilePath = path.join(__dirname, fileName);

  const file = fs.createWriteStream(outputFilePath);

  https.get(fileUrl, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        console.log('File downloaded successfully.');
      });
    });
  }).on('error', (err) => {
    fs.unlink(outputFilePath, () => {
      console.error('File download failed:', err.message);
    });
  });*/
    
  const disposable = vscode.commands.registerCommand('install', async () => {
    
    const batPath = path.join(context.extensionPath, 'path', 'path.bat');
    const zipPath = path.join(context.extensionPath, 'mingw64.zip');
    const configFolderPath = path.join(context.extensionPath, 'config', '.vscode');
    //const destnPath = './.vscode';
    const destnPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode');
    console.log(destnPath);

    const extensionId = 'ms-vscode.cpptools';
    const extensionUrl = `vscode:extension/${extensionId}`;

    const terminal = vscode.window.createTerminal({
      shellPath: 'powershell.exe',
      name: '配置C/C++环境'
    });

    terminal.show(true);

    //await terminal.sendText('Remove-Item -Path "mingw64.zip" -Force -ErrorAction SilentlyContinue');
    //await terminal.sendText('Invoke-WebRequest -Uri "https://waiterlovescript.github.io/resources/mingw64.zip" -OutFile "mingw64.zip"');

    await terminal.sendText('Remove-Item -Path "C:/MinGW" -Force -Recurse -ErrorAction SilentlyContinue');
    await terminal.sendText(`Expand-Archive -Path "${zipPath}" -DestinationPath "C:/MinGW"`);

    //await terminal.sendText('Remove-Item -Path "mingw64.zip" -Force -ErrorAction SilentlyContinue');

    await terminal.sendText(`${batPath}`);

    await terminal.sendText('Write-Host "Finished! Congratulations!" -ForegroundColor Green');

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
    vscode.window.showInformationMessage('您需要下载此扩展C/C++');
    vscode.window.showInformationMessage('由于Expand-Archive较慢, 请耐心等待~后续会考虑优化');

    fs.copyFileSync(path.join(context.extensionPath, 'config', 'test.cpp'), path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'test.cpp'));

  })

  context.subscriptions.push(disposable);

}

function deactivate() {}

module.exports = { activate, deactivate }