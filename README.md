mainpage 폴더 안 jsx 파일의 컨포넌트 실행 순서

로그인 성공 시

메인 화면
SelectMainpage.jsx(선택 페이지)

루틴 생성 시
SelectMainpage.jsx(선택 페이지) -> 생성 버튼 선택 후 -> CategoryPage.jsx(루틴 생성 페이지) -> 운동 추가 선택 후(중복 선택 가능) -> SelectMainpage.jsx(선택 페이지)

루틴 삭제시
SelectMainpage.jsx(선택 페이지) -> 생성된 루틴 더보기 선택 -> 루틴 삭제 선택 -> 삭제됨

루틴 내 운동 삭제시
RoutinePage.jsx(루틴 상세(시작) 페이지) -> 운동 더보기 선택 -> 운동 삭제 선택 -> 삭제됨

저장된 루틴 확인
SelectMainpage.jsx(선택 페이지) ->  RoutinePage.jsx(루틴 상세(시작) 페이지)

루틴 실행
SelectMainpage.jsx(선택 페이지) -> 루틴 선택 후 -> RoutinePage.jsx(루틴 상세(시작) 페이지) -> 운동 시작 버튼 실행 -> RunningRoutinePage.jsx(루틴 실행 후 운동 기록 페이지)

루틴 종료
RunningRoutinePage.jsx(루틴 실행 후 운동 기록 페이지) -> 루틴 종료 버튼 선택 후 -> RoutineResultPage.jsx(종료 후 결과 페이지)

루틴이 실행 중 운동 추가 및 삭제
RunningRoutinePage.jsx(루틴 실행 후 운동 기록 페이지) -> 운동 추가 선택 -> CategoryPage.jsx(루틴 생성 페이지) -> 운동 추가 및 삭제 선택 후 -> RoutinePage.jsx(루틴 상세(시작) 페이지)




