# 使用

这款扩展是采用了C/C++和MinGW来实现C++或者C语言环境的配置，除了一键配置之后，用户还需要在vscode中手动安装名为C/C++的扩展（相关页面已为用户自动打开）。</br>

**这款扩展的工作流程如下**：</br>

1. 打开命令界面（ctrl+shift+p）搜索“**快速配置C/C++**”并点击，首先扩展会自动下载MinGW的压缩包并且解压保存到C:/MinGW/目录下

2. 然后扩展会启动一个**path.bat**脚本，将MinGW的bin目录添加到用户变量中
（推荐但不要求，用户可以手动**以管理员身份运行path_root.bat**脚本来添加到系统变量，即C:/Users/your_usr_name/.vscode/extensions/lovescript.fastc/config/path_root.bat）

3. 最后扩展会在当前打开的目录下生成一个.vscode文件夹跟一个test.cpp文件，</br>

如果您已经完成了上述操作并且下载了扩展C/C++，那么您现在可以运行这个test.cpp文件了！</br>
您可以阅读一下.vscode文件夹中三个json文件中的注释部分
## 您可以在任何文件夹中运行c或者cpp代码，前提是您在vscode打开的文件夹中有.vscode这个文件夹！.vscode文件夹是可以随意复制粘贴的！
## 代码文件请不要使用中文命名，路径中也请不要出现中文，因为中文命名会带来不必要的麻烦

# 原理

MinGW是用来编译跟调试代码的工具，而扩展C/C++是为了提供语法检查以及便捷的调试功能。.vscode文件夹则是在告诉vscode如何处理代码文件</br>
