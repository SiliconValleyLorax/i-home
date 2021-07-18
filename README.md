# i-home


### nginx 테스트 하는 법
+ 1. docker-compose.yml -> docker-compose.dev.yml 로 이름 변경
+ 2. docker-compose.prod.yml -> docker-compose.yml 로 이름 변경
+ 3. docker-compose up --build
+ 4. localhost:8080 으로 들어가서 테스트 (React 메인 화면)
+ 5. localhost:8080/uploadimage 로 들어가서 REST API 테스트
+ 6. model서버도 연결해뒀는데, 테스트는 어떻게 해야될지 모르겟음... 아마 api server랑 연결돼있는 api를 완성시켜야 테스트할 수 있을 것 같기도..