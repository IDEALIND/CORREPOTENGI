function Get-CRC16($payload) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
    $crc = 0xFFFF
    $polynomial = 0x1021

    foreach ($b in $bytes) {
        $crc = $crc -bxor ($b -shl 8)
        for ($i = 0; $i -lt 8; $i++) {
            if (($crc -band 0x8000) -ne 0) {
                $crc = (($crc -shl 1) -bxor $polynomial) -band 0xFFFF
            } else {
                $crc = ($crc -shl 1) -band 0xFFFF
            }
        }
    }
    return $crc.ToString("X4").ToUpper()
}

function Build-PixPayload($key, $name, $city, $amount, $txid) {
    $cur = "986" # BRL
    
    # 00: Format
    $p00 = "000201"
    
    # 26: Merchant Account Information
    $gui = "0014BR.GOV.BCB.PIX"
    $kLen = $key.Length.ToString("D2")
    $k = "01$kLen$key"
    $accInfo = "$gui$k"
    $p26 = "26" + $accInfo.Length.ToString("D2") + $accInfo
    
    # 52: MCC
    $p52 = "52040000"
    # 53: Currency
    $p53 = "5303986"
    
    # 54: Amount
    $amtStr = $amount.ToString("F2", [System.Globalization.CultureInfo]::InvariantCulture)
    $p54 = "54" + $amtStr.Length.ToString("D2") + $amtStr
    
    # 58: Country
    $p58 = "5802BR"
    
    # 59: Name (max 25)
    $n = if ($name.Length -gt 25) { $name.Substring(0, 25) } else { $name }
    $p59 = "59" + $n.Length.ToString("D2") + $n
    
    # 60: City (max 15)
    $c = if ($city.Length -gt 15) { $city.Substring(0, 15) } else { $city }
    $p60 = "60" + $c.Length.ToString("D2") + $c
    
    # 62: Additional Data Field (TxID)
    $tid = if ([string]::IsNullOrEmpty($txid)) { "***" } else { $txid }
    $tField = "05" + $tid.Length.ToString("D2") + $tid
    $p62 = "62" + $tField.Length.ToString("D2") + $tField
    
    # Pre-CRC payload
    $raw = "$p00$p26$p52$p53$p54$p58$p59$p60$p62" + "6304"
    $crc = Get-CRC16 $raw
    return "$raw$crc"
}

$pix59 = Build-PixPayload "aylson.gabriel@outlook.com" "AYLSON GABRIEL DA S PEREI" "SAO PAULO" 59.99 "2ZrFNTXi03emEnfKPP0c5h"
Write-Host "PIX Payload (R$ 59,99):"
Write-Host $pix59

$pix119 = Build-PixPayload "aylson.gabriel@outlook.com" "AYLSON GABRIEL DA S PEREI" "SAO PAULO" 119.98 "CORREPOTENGI"
Write-Host "PIX Payload (R$ 119,98):"
Write-Host $pix119
