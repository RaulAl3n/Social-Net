$url = "https://archive.apache.org/dist/maven/maven-3/3.9.5/binaries/apache-maven-3.9.5-bin.zip"
$output = "C:\temp_maven.zip"
$dest = "C:\"

Write-Host "Criando pasta temporária..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "C:\temp" > $null

Write-Host "Baixando Maven..." -ForegroundColor Yellow
(New-Object System.Net.WebClient).DownloadFile($url, $output)

Write-Host "Extraindo..." -ForegroundColor Yellow
Expand-Archive -Path $output -DestinationPath $dest -Force

Remove-Item $output -Force

Write-Host "Maven instalado em C:\apache-maven-3.9.5" -ForegroundColor Green

Write-Host "Testando Maven..." -ForegroundColor Cyan
& "C:\apache-maven-3.9.5\bin\mvn.cmd" --version

Write-Host "`nMaven pronto! Pressione Enter..." -ForegroundColor Green
Read-Host
