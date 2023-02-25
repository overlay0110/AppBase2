# AppBase2

구조 설계, 개발환경 구성, 필요한 라이브러리 추가 등의 작업 시간 단축하기 위해 만든 범용 앱 프로젝트 파일입니다.

# Environment
|제목|상세|
|------|---|
|생성일|2020년 8월|
|react-native|0.62.2|
|Android SDK|23 ~ 29|

기타 모듈 정보는 package.json에서 확인 가능

# Work
* 인터넷 연결 여부
    * @react-native-community/netinfo를 사용, 사용 위치 : App.js
* Rooting or Jailbreaking 체크
    * 운영 체제 상에서 최상위 권한을 얻음으로 해당 기기의 생산자 또는 판매자 측에서 걸어 놓은 제약을 해제하는 행위를 가리키는 말이다.
    * jail-monkey를 사용, 사용 위치 : src/main/components/Lock/Load.js
* 스플래시 스크린 세팅
* Redux 사용
    * react에서 자주 사용되는 상태 관리 라이브러리
* 파일 DB 연동
    * Sqlite3를 사용, 오프라인 앱의 데이터를 저장할때 사용
* 암호화 함수 SHA-256, AES-256를 사용
* POST 전송
* 다국어 세팅
    * 세팅언어 : 한국어, 영어, 사용 위치 : src/main/assets/locale/index.js
* QR Code Scanner
* FCM 푸시 알림 연동
* 메신저 대화 UI 및 기능 구현
    * 대화 내용 파일 DB에 저장, FCM 푸시 알림 사용, 사용 위치 : src/main/components/Test/Chat.js
* 앱 위치 값 불러오기
* NFC 인식
* 지문인식
* 패턴 잠금
* 핀번호 인증
* 라이브 방송 보기, 방송 송출
* 채팅 기능(소켓서버 연동)
