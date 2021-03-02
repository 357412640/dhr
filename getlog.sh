# !/bin/bash
confirm=0

#上次版本缓存
lastTagFile=".lastTag"
if [ ! -f "$lastTagFile" ];then
  touch "$lastTagFile"
fi

#新建release目录
if [ ! -d "release" ];then
  mkdir release
fi

# 读取上次版本号
lastTag=$(cat .lastTag)

while [ $confirm -eq 0 ]
do
  read -p "请输入上一版本tag号: $lastTag " lastTagInput
          if [ -n "$lastTagInput" ];then
            lastTag="$lastTagInput"
          fi
#echo "=====$lastTagInput"
#echo "*****$lastTag"
    
  while [ ! -n "$lastTag" ]
  do
    read -p "请输入上一版本tag号: " lastTag
  done

  while [ ! -n "$thisTag" ]
  do
    read -p "请输入本次版本tag号: " thisTag
  done

 # 此时默认为1  
  confirm=1

  read -p  "上一版本号: $lastTag,本次版本号: $thisTag, 是否确认？(0/1) $confirm: " confirmInput
  if [ -n "$confirmInput" ];then
  #echo "====:$confirmInput"
           if [ $confirmInput -eq 0 ];then
             confirm=0
             thisTag=""
           else
             confirm=1
           fi
  fi

done

#echo "$confirm---$lastTag---$thisTag"
echo "$thisTag" > "$lastTagFile"

git log --no-merges --graph --pretty=format:'%s %Cgreen(%cn,%ad)' --date=format:'%Y-%m-%d %H:%M'  DHR-web_${lastTag}_BL...DHR-web_${thisTag}_BL > "release/release_v${thisTag}.txt"

echo "successfully"
