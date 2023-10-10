const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');

async function activate(context) {
  const userHome = os.homedir();
  const configFolder = path.join(userHome, 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'lovescript.fastc');
  

  const zipPath = path.join(context.extensionPath, 'mingw64.zip');
  const folderPath = path.join(context.extensionPath, 'config', '.vscode');

  const extensionId = 'ms-vscode.cpptools';
  const extensionUrl = `vscode:extension/${extensionId}`;

  let destnPath = 'D:/example';

  function copyFolder(src, dest)
  {
    fs.readdirSync(src).forEach((item) => {
      const sourceItemPath = path.join(src, item);
      const destinationItemPath = path.join(dest, item);
      if(fs.lstatSync(sourceItemPath).isDirectory())
      {
        fs.mkdirSync(destinationItemPath);
        copyFolder(sourceItemPath, destinationItemPath);
      }
      else
      {
        fs.copyFileSync(sourceItemPath, destinationItemPath);
      }
    });
  }

  function copyConfig()
  {
    destnPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode');
    if(!fs.existsSync(destnPath))
    {
      fs.mkdirSync(destnPath, { recursive: true });
    }
    copyFolder(folderPath, destnPath);
    fs.copyFileSync(path.join(context.extensionPath, 'config', 'test.cpp'), path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'test.cpp'));
  }

  if(!fs.existsSync(path.join(configFolder, 'a.txt')))
  {
    fs.mkdirSync(configFolder, { recursive: true });
    fs.writeFileSync(path.join(configFolder, 'a.txt'), 'to_init', 'utf-8');
    const choice1 = await vscode.window.showInformationMessage(
      '是否立即配置C/C++环境？您也可以后续在命令面板中使用"一键配置C/C++"来配置',
      'Yes',
      'No');
    if(choice1 === 'Yes')
    {
      vscode.commands.executeCommand('install');
    }
  }
  
  const configFile = fs.readFileSync(path.join(configFolder, 'a.txt'), 'utf8').split('\n');
  const config = configFile.filter((item) => item.trim() !== '');

  if(config[0] === 'pre_copy' && vscode.workspace.workspaceFolders)
  {
    copyConfig();
    fs.writeFileSync(path.join(configFolder, 'a.txt'), 'ready_install', 'utf-8');
  }

    
  const disposable = vscode.commands.registerCommand('install', async () => {

    const terminal = vscode.window.createTerminal({
      shellPath: 'powershell.exe',
      name: '配置C/C++环境'
    });

    terminal.show(true);

    // TODO: 添加MinGW
    //await terminal.sendText('Remove-Item -Path "mingw64.zip" -Force -ErrorAction SilentlyContinue');
    //await terminal.sendText('Invoke-WebRequest -Uri "https://waiterlovescript.github.io/resources/mingw64.zip" -OutFile "mingw64.zip"');

    if(!fs.existsSync('C:/MinGW/mingw64/bin/g++.exe'))
    {
      terminal.sendText('Remove-Item -Path "C:/MinGW" -Force -Recurse -ErrorAction SilentlyContinue');
      terminal.sendText(`Expand-Archive -Path "${zipPath}" -DestinationPath "C:/MinGW"`);
      terminal.sendText("$path2add = ';C:/MinGW/mingw64/bin'\n"+
        "$systemPath = [Environment]::GetEnvironmentVariable('Path', 'user')\n"+
        "If (!$systemPath.contains($path2add)) {\n"+
        "$systemPath += $path2add\n"+
        "$systemPath = $systemPath -join ';'\n"+
        "[Environment]::SetEnvironmentVariable('Path', $systemPath, 'User');\n"+
        "Write-Host 'Finished! Congratulations!' -ForegroundColor Green\n"+
      "}\n")

      vscode.env.openExternal(vscode.Uri.parse(extensionUrl));
      vscode.window.showInformationMessage('您需要下载此扩展C/C++');
      vscode.window.showInformationMessage('您可以阅读一下本扩展的详情，即主页');
      vscode.window.showInformationMessage('由于Expand-Archive较慢, 请耐心等待~后续会考虑优化');
    }

    // TODO: 添加用户变量
    //await terminal.sendText(`${batPath}`);

    //await terminal.sendText('Write-Host "Finished! Congratulations!" -ForegroundColor Green');

    if(vscode.workspace.workspaceFolders !== undefined)
    {
      copyConfig();
    }
    else
    {
      vscode.window.showWarningMessage('如果当前终端中有未完成的进度, 请等待终端进度完成之后再决定是否点击Yes')
      const choice2 = await vscode.window.showErrorMessage('当前没有打开的文件夹, 因此无法进行.vscode文件夹的写入!\n'
      +'是否立即打开您想要存放代码的文件夹?\n'
      +' 如果您现在选择了No, 之后也可以使用命令"一键配置C/C++环境"来进行写入',
      'Yes',
      'No');
      if(choice2 === 'Yes')
      {
          fs.writeFileSync(path.join(configFolder, 'a.txt'), 'pre_copy', 'utf-8');
          console.log(config[0]);
          await vscode.commands.executeCommand('workbench.action.files.openFolder');
      }
    }

  })

  context.subscriptions.push(disposable);

}

function deactivate() {}

module.exports = { activate, deactivate }