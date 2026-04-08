# 투두 MVP 구현 계획서

> **에이전트 작업용:** REQUIRED SUB-SKILL: 이 계획을 실제 구현할 때는 `superpowers:subagent-driven-development`(권장) 또는 `superpowers:executing-plans`를 사용한다. 진행 추적은 체크박스(`- [ ]`) 형식을 따른다.

**목표:** 빠른 할 일 추가, 자동 상태 분류, 상세 편집, 완료 흐름, 간단한 설정을 포함한 리스트형 투두 앱 MVP를 구현한다.

**아키텍처:** React + TypeScript + Vite 기반의 작은 웹앱으로 구성하고, 데이터는 로컬 상태와 `localStorage`에 저장한다. 날짜 기반 상태 판정은 순수 함수 유틸로 분리해 UI와 독립적으로 테스트할 수 있게 만든다.

**기술 스택:** React, TypeScript, Vite, Vitest, Testing Library, CSS 변수

---

### 작업 1: 앱 기본 구조 만들기

**파일:**
- 생성: `package.json`
- 생성: `tsconfig.json`
- 생성: `vite.config.ts`
- 생성: `src/main.tsx`
- 생성: `src/App.tsx`
- 생성: `src/index.css`

- [ ] Vite + React + TypeScript 앱 구조를 만든다.
- [ ] 실행 및 테스트에 필요한 의존성을 설치한다.
- [ ] 개발 서버와 테스트 러너가 정상 시작되는지 확인한다.

### 작업 2: 할 일과 설정 모델 정의

**파일:**
- 생성: `src/types/task.ts`
- 생성: `src/types/settings.ts`
- 생성: `src/lib/date.ts`
- 테스트: `src/types/task.test.ts`
- 테스트: `src/types/settings.test.ts`
- 테스트: `src/lib/date.test.ts`

- [ ] 수동 상태 편집, 라벨 변경, 이월에 필요한 할 일/설정 데이터 구조 테스트를 먼저 작성한다.
- [ ] 테스트를 실행해 모델이 아직 없어서 실패하는지 확인한다.
- [ ] 최소한의 타입과 생성 함수를 구현한다.
- [ ] 모델 테스트가 통과하는지 확인한다.
- [ ] 날짜 계산 유틸 테스트를 먼저 작성한다.
- [ ] 테스트를 실행해 기대한 이유로 실패하는지 확인한다.
- [ ] 최소 구현으로 날짜 유틸을 만든다.
- [ ] 날짜 유틸 테스트가 통과하는지 확인한다.

### 작업 3: 상태 판정 만들기

**파일:**
- 생성: `src/lib/statuses.ts`
- 테스트: `src/lib/statuses.test.ts`

- [ ] `오늘 마감`, `늦은 일`, `여유` 자동 판정 테스트를 먼저 작성한다.
- [ ] `오늘 마감`, `늦은 일`, `여유`, `중요도` 수동 수정값이 자동 판정보다 우선되는 테스트를 추가한다.
- [ ] 테스트를 실행해 기대한 이유로 실패하는지 확인한다.
- [ ] 최소 구현으로 상태 계산 함수를 만든다.
- [ ] 테스트를 실행해 기대한 이유로 실패하는지 확인한다.
- [ ] 최소 구현으로 상태 계산 함수를 만든다.
- [ ] 상태 관련 테스트가 모두 통과하는지 확인한다.

### 작업 4: 로컬 앱 상태 만들기

**파일:**
- 생성: `src/lib/storage.ts`
- 생성: `src/hooks/useTodoApp.ts`
- 테스트: `src/hooks/useTodoApp.test.ts`

- [ ] 할 일 추가, 완료 처리, 내일로 넘기기, 설정 변경 테스트를 먼저 작성한다.
- [ ] 테스트를 실행해 기대한 이유로 실패하는지 확인한다.
- [ ] 최소 구현으로 상태 훅과 `localStorage` 저장 로직을 만든다.
- [ ] 상태 훅 테스트가 통과하는지 확인한다.

### 작업 5: 메인 화면 구현

**파일:**
- 수정: `src/App.tsx`
- 생성: `src/components/TaskComposer.tsx`
- 생성: `src/components/TopTasks.tsx`
- 생성: `src/components/CompletedTasks.tsx`
- 생성: `src/components/ListBanner.tsx`
- 생성: `src/components/AchievementSummary.tsx`
- 생성: `src/components/StatusIcon.tsx`
- 생성: `src/components/LayoutShell.tsx`
- 생성: `src/lib/coachCopy.ts`
- 테스트: `src/App.test.tsx`
- 테스트: `src/lib/coachCopy.test.ts`

- [ ] 오늘 날짜 표시, 할 일 입력, 할 일 목록, 성취 요약, 완료 영역 테스트를 먼저 작성한다.
- [ ] 리스트 문구가 날짜에 따라 바뀌고 톤 설정을 따르는 테스트를 작성한다.
- [ ] 메인 화면에서 오늘 날짜가 보이는지 검증하는 테스트를 포함한다.
- [ ] 테스트를 실행해 기대한 이유로 실패하는지 확인한다.
- [ ] 단순하지만 의도 있는 레이아웃으로 메인 화면을 구현한다.
- [ ] 메인 화면 테스트가 통과하는지 확인한다.

### 작업 6: 할 일 상세 화면 구현

**파일:**
- 생성: `src/components/TaskDetailPanel.tsx`
- 생성: `src/components/TaskStepsEditor.tsx`
- 수정: `src/App.tsx`
- 테스트: `src/components/TaskDetailPanel.test.tsx`

- [ ] 상세 화면 열기, 제목 수정, 마감일 수정, 중요도 수정, 메모 수정 테스트를 먼저 작성한다.
- [ ] `내일로 넘기기`, 수동 상태 수정, `단계 템플릿 추천` 버튼 흐름 테스트를 추가한다.
- [ ] 테스트를 실행해 기대한 이유로 실패하는지 확인한다.
- [ ] 최소 구현으로 상세 패널과 단계 추천 기능을 만든다.
- [ ] 상세 화면 테스트가 통과하는지 확인한다.

### 작업 7: 설정 화면 구현

**파일:**
- 생성: `src/components/SettingsPanel.tsx`
- 수정: `src/App.tsx`
- 테스트: `src/components/SettingsPanel.test.tsx`

- [ ] `오늘 마감 기준`, `늦은 일 기준`, `여유 기준 일수` 수정 테스트를 먼저 작성한다.
- [ ] `오늘 마감`, `늦은 일`, `여유` 라벨 변경 테스트를 추가한다.
- [ ] 리스트 문구 톤 변경 테스트를 추가한다.
- [ ] 테스트를 실행해 기대한 이유로 실패하는지 확인한다.
- [ ] 최소 구현으로 설정 패널을 만든다.
- [ ] 설정 화면 테스트가 통과하는지 확인한다.

### 작업 8: UI 다듬기

**파일:**
- 수정: `src/index.css`
- 수정: `src/App.tsx`

- [ ] 심플한 플래너 느낌의 색상, 여백, 카드, 뱃지 스타일을 정리한다.
- [ ] 데스크톱과 모바일에서 레이아웃이 모두 읽기 쉬운지 확인한다.

### 작업 9: 최종 검증

**파일:**
- 테스트: `src/**/*.test.ts*`

- [ ] 전체 테스트를 실행한다.
- [ ] 프로덕션 빌드를 실행한다.
- [ ] 실패 항목이 있으면 수정 후 다시 확인한다.

---

## 현재 구현 이후 바로 보완할 항목

리뷰 기준으로 MVP에서 우선 보완할 항목은 아래와 같다.

- [ ] `오늘 성취`와 `완료한 일`을 전체 누적이 아니라 `오늘 기준`으로 집계되게 수정
- [ ] 수동 상태 수정 UI를 `자동 / 켜기 / 끄기`처럼 더 명확하게 바꾸기
- [ ] 상세 화면에서 `내일로 넘기기` 후 저장 시 날짜가 다시 덮어써지지 않게 수정
- [ ] 단계 목록을 읽기 전용이 아니라 직접 추가/수정 가능하게 개선
- [ ] 상세/설정 패널 접근성(`dialog`, `aria-modal`, 키보드 닫기`) 보완
- [ ] 화면에 남아 있는 영문 문구를 모두 한글로 통일
