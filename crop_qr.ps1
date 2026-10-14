Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\aylso\Site Corre\assets\pix_qrcode_inter.jpg"
$destPath = "c:\Users\aylso\Site Corre\assets\qrcode_only.png"

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# The QR Code white square is in the center around Y=200 to Y=720, X=180 to X=600
# Let's inspect horizontal scanline at Y=400 to find the left and right border of the white square
$yMid = 450
$leftX = -1
$rightX = -1

for ($x = 50; $x -lt ($bmp.Width - 50); $x++) {
    $p = $bmp.GetPixel($x, $yMid)
    if ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240) {
        $leftX = $x
        break
    }
}

for ($x = ($bmp.Width - 50); $x -gt 50; $x--) {
    $p = $bmp.GetPixel($x, $yMid)
    if ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240) {
        $rightX = $x
        break
    }
}

Write-Host "QR Code horizontal range at Y=$($yMid): Left=$leftX, Right=$rightX, Width=$($rightX - $leftX)"

# Now find top and bottom at X=($leftX + 20)
$xProbe = $leftX + 20
$topY = -1
$bottomY = -1

for ($y = 100; $y -lt 800; $y++) {
    $p = $bmp.GetPixel($xProbe, $y)
    if ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240) {
        $topY = $y
        break
    }
}

for ($y = 800; $y -gt 100; $y--) {
    $p = $bmp.GetPixel($xProbe, $y)
    if ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240) {
        $bottomY = $y
        break
    }
}

Write-Host "QR Code vertical range: Top=$topY, Bottom=$bottomY, Height=$($bottomY - $topY)"

$qrWidth = $rightX - $leftX
$qrHeight = $bottomY - $topY

# Add small margin or exact crop
$rect = New-Object System.Drawing.Rectangle($leftX, $topY, $qrWidth, $qrHeight)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$cropped.Dispose()
Write-Host "Done! Cropped EXACT QR code: $qrWidth x $qrHeight"
