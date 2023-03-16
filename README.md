# Youtube-Dl-to-NAS-Chrome-Extension
Youtube-Dl to NAS 의 크롬 확장 프로그램입니다. 

시놀로지 나스 도커에서 실행 가능한 youtube-dl-nas 의 확장 프로그램 입니다.
(https://github.com/hyeonsangjeon/youtube-dl-nas)

유튜브 영상 링크 우 클릭 또는 유튜브 영상 텍스트 드래그 후 우 클릭시 
컨텍스트 메뉴가 표시됩니다.

해상도를 선택하면 youtube-dl 설치 시 지정한 폴더로 mp4 파일이 저장 됩니다.

1080p 보다 큰 해상도의 영상은 av1 코덱으로 저장 되기 때문에 나스에서 재생 불가능 할 수 있습니다.

이 확장 프로그램을 사용하기 위해서는 youtube-dl 서비스를 나스에 설치 해야 합니다

설정에는 youtube-dl에서 설정한 아이디, 패스워드와 youtube-dl 접속주소 + /rest 를 rest api 부분에 입력해 준 후 save 버튼을 눌러 저장합니다.

유튜브 영상 링크 화면에서 우클릭 후 컨텍스트 메뉴에서 해상도를 선택, 그 후 나스의 폴더에 정상적으로 다운로드가 됐는지 확인 해보시고 

안된다면 아이디와 패스워드 혹은 접속 주소가 정상인지 확인 해보시기 바랍니다.
