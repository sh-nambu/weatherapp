# TypeScriptコードをJavaScriptにトランスパイル
FROM public.ecr.aws/lambda/nodejs:16 as builder
WORKDIR /build
COPY package*.json tsconfig*.json ./
COPY weather-info/package*.json weather-info/tsconfig*.json ./weather-info/
COPY weather-info/src ./weather-info/src

RUN npm install && npm run build

# JavaScriptファイルと本番環境の依存関係のみを含むコンテナイメージを生成
FROM public.ecr.aws/lambda/nodejs:16
# ビルド対象のプロジェクト（docker buildコマンドの引数として--build-argで渡す）
ARG project
COPY --from=builder /build ./
# RUN cp -a ${project}/dist/* ./
COPY ${project}/dist/* ./
CMD ["index.handler"]