param(
    [Parameter(Mandatory=$false)][string[]]$ImageNames = @("backend", "frontend", "database", "saml")
)
function PushDockerImage {
    param(
        [Parameter(Mandatory=$true)][string]$ImageName
    )
    Set-Location $ImageName
    docker build -t $ImageName .
    docker tag $ImageName atari2/thesismanagement:$ImageName
    docker push atari2/thesismanagement:$ImageName
    Set-Location ..
}

for ($i = 0; $i -lt $ImageNames.Length; $i++) {
    $ImageName = $ImageNames[$i]
    PushDockerImage $ImageName
}