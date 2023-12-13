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

PushDockerImage "backend"
PushDockerImage "frontend"
PushDockerImage "database"
PushDockerImage "saml"