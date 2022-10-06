# ビルド & プッシュ

- ECRにログインする
aws ecr get-login-password | docker login --username AWS --password-stdin 847790860507.dkr.ecr.ap-northeast-1.amazonaws.com

- ビルドする
docker build -t 847790860507.dkr.ecr.ap-northeast-1.amazonaws.com/weather-info-function-image:latest . --build-arg project=weather-info

- プッシュする
docker push 847790860507.dkr.ecr.ap-northeast-1.amazonaws.com/weather-info-function-image:latest