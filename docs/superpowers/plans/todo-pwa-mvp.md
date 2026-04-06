# 투두 PWA MVP 구현 계획서

> **에이전트 작업용:** 이 계획을 실제 구현할 때는 `superpowers:subagent-driven-development` 또는 `superpowers:executing-plans`를 사용한다. 진행 추적은 체크박스(`- [ ]`) 형식을 따른다.

**목표:** 설치 가능한 PWA 기반의 코치형 투두 앱 MVP를 구현한다. 사용자는 할 일을 빠르게 추가하고, 오프라인에서도 저장된 할 일을 조회하고 완료 체크할 수 있어야 한다.

**아키텍처:** React + TypeScript + Vite 기반 웹앱에 PWA 구성을 추가한다. 앱 셸, 상태 판정, 로컬 저장을 분리하고, `manifest`와 `service worker`를 통해 설치형 앱 경험을 제공한다. MVP는 PWA 우선형으로 구현하고, 이후 필요 시 Tauri 래핑으로 확장할 수 있게 유지한다.

**기술 스택:** React, TypeScript, Vite, Vitest, Testing Library, CSS 변수, PWA manifest, service worker, localStorage

---

### 작업 1: PWA 기반 앱 구조 정리

**파일:**
- 생성: `package.json`
- 생성: `tsconfig.json`
- 생성: `vite.config.ts`
- 생성: `index.html`
- 생성: `src/main.tsx`
- 생성: `src/App.tsx`
- 생성: `src/index.css`

- [ ] React + TypeScript + Vite 기반 앱 구조를 만든다.
- [ ] 테스트 및 빌드 의존성을 설치한다.
- [ ] 앱이 웹 기준으로 정상 실행되는지 확인한다.
- [ ] 이후 PWA 구성을 붙일 수 있는 기본 구조를 확보한다.

### 작업 2: 할 일/설정 모델 정의

**파일:**
- 생성: `src/types/task.ts`
- 생성: `src/types/settings.ts`
- 생성: `src/lib/date.ts`
- 테스트: `src/types/task.test.ts`
- 테스트: `src/types/settings.test.ts`
- 테스트: `src/lib/date.test.ts`

- [ ] 할 일, 중요도, 수동 상태 수정, 메모, 단계 목록, 완료 시점 데이터를 위한 모델 테스트를 먼저 작성한다.
- [ ] 설정값(오늘 마감 기준, 늦은 일 기준, 여유 기준, 라벨, 문구 톤) 테스트를 먼저 작성한다.
- [ ] 날짜 계산 유틸 테스트를 작성한다.
- [ ] 테스트 실패를 확인한 뒤 최소 구현으로 타입과 유틸을 만든다.
- [ ] 모델/날짜 테스트가 모두 통과하는지 확인한다.

### 작업 3: 상태 판정 구현

**파일:**
- 생성: `src/lib/statuses.ts`
- 테스트: `src/lib/statuses.test.ts`

- [ ] `오늘 마감`, `늦은 일`, `여유` 자동 판정 테스트를 먼저 작성한다.
- [ ] 사용자의 수동 상태 수정값이 자동 판정보다 우선되는 테스트를 추가한다.
- [ ] 테스트 실패를 확인한 뒤 최소 구현으로 상태 계산 로직을 만든다.
- [ ] 상태 관련 테스트가 모두 통과하는지 확인한다.

### 작업 4: 로컬 저장과 앱 상태 훅 구현

**파일:**
- 생성: `src/lib/storage.ts`
- 생성: `src/hooks/useTodoApp.ts`
- 테스트: `src/hooks/useTodoApp.test.ts`

- [ ] 할 일 추가, 완료 처리, 내일로 넘기기, 설정 변경 테스트를 먼저 작성한다.
- [ ] 저장된 할 일을 다시 불러오는 테스트를 작성한다.
- [ ] 오프라인에서도 최근 데이터가 유지되는 전제의 로컬 저장 흐름을 검증한다.
- [ ] 테스트 실패를 확인한 뒤 최소 구현으로 상태 훅과 `localStorage` 저장 로직을 만든다.
- [ ] 상태 훅 테스트가 통과하는지 확인한다.

### 작업 5: 메인 화면 MVP 구현

**파일:**
- 수정: `src/App.tsx`
- 생성: `src/components/LayoutShell.tsx`
- 생성: `src/components/CoachBanner.tsx`
- 생성: `src/components/TaskComposer.tsx`
- 생성: `src/components/TopTasks.tsx`
- 생성: `src/components/CompletedTasks.tsx`
- 생성: `src/components/AchievementSummary.tsx`
- 생성: `src/components/StatusIcon.tsx`
- 생성: `src/lib/coachCopy.ts`
- 테스트: `src/App.test.tsx`
- 테스트: `src/lib/coachCopy.test.ts`

- [ ] 메인 화면에 오늘 날짜, 코치 문구, 빠른 추가, 할 일 목록, 오늘 완료한 일 영역이 보이는 테스트를 먼저 작성한다.
- [ ] 코치 문구가 날짜마다 바뀌고 톤 설정을 따르는 테스트를 작성한다.
- [ ] 메인 카드가 `상태 / 제목 / 마감일` 순서로 노출되는 구조를 반영한다.
- [ ] 카드 형태는 `가로로 길고 낮은 카드`로 구성한다.
- [ ] 상태는 `아이콘 + 짧은 텍스트 태그`로 표시한다.
- [ ] 테스트 실패를 확인한 뒤 메인 화면을 구현한다.
- [ ] 메인 화면 테스트가 통과하는지 확인한다.

### 작업 6: 할 일 상세 화면 구현

**파일:**
- 생성: `src/components/TaskDetailPanel.tsx`
- 생성: `src/components/TaskStepsEditor.tsx`
- 수정: `src/App.tsx`
- 테스트: `src/components/TaskDetailPanel.test.tsx`

- [ ] 상세 화면 열기, 제목 수정, 마감일 수정, 중요도 수정, 메모 수정 테스트를 먼저 작성한다.
- [ ] `내일로 넘기기`, 수동 상태 수정, `단계 템플릿 추천` 버튼 흐름 테스트를 추가한다.
- [ ] 테스트 실패를 확인한 뒤 최소 구현으로 상세 패널과 단계 추천 기능을 만든다.
- [ ] 상세 화면 테스트가 통과하는지 확인한다.

### 작업 7: 설정 화면 구현

**파일:**
- 생성: `src/components/SettingsPanel.tsx`
- 수정: `src/App.tsx`
- 테스트: `src/components/SettingsPanel.test.tsx`

- [ ] `오늘 마감 기준`, `늦은 일 기준`, `여유 기준 일수` 수정 테스트를 먼저 작성한다.
- [ ] `오늘 마감`, `늦은 일`, `여유` 라벨 변경 테스트를 작성한다.
- [ ] 코치 문구 톤(`응원형`, `담백형`) 변경 테스트를 작성한다.
- [ ] 테스트 실패를 확인한 뒤 설정 패널을 구현한다.
- [ ] 설정 화면 테스트가 통과하는지 확인한다.

### 작업 8: PWA 설치 구성 추가

**파일:**
- 생성: `public/manifest.webmanifest`
- 생성: `public/icons/*`
- 생성: `src/pwa/registerServiceWorker.ts`
- 생성: `src/sw.ts` 또는 `public/sw.js`
- 수정: `index.html`
- 테스트: 수동 검증 항목 문서화

- [ ] 앱 이름, 아이콘, 테마 색상, 실행 모드를 포함한 `manifest`를 구성한다.
- [ ] 홈 화면 설치가 가능하도록 기본 메타 구성을 추가한다.
- [ ] 앱 셸과 핵심 정적 리소스를 캐시하는 service worker 전략을 정의한다.
- [ ] iPhone 홈 화면 추가 기준으로 앱 아이콘/실행 형태를 확인한다.
- [ ] 설치 후 독립 실행 모드처럼 보이는지 검증한다.

### 작업 9: 오프라인 동작 MVP 구성

**파일:**
- 수정: `src/lib/storage.ts`
- 수정: `src/sw.ts` 또는 `public/sw.js`
- 테스트: 수동 검증 항목 문서화

- [ ] 오프라인에서 앱 셸이 열리는지 확인한다.
- [ ] 저장된 할 일 목록이 오프라인에서도 조회되는지 확인한다.
- [ ] 완료 체크가 오프라인에서도 반영되는지 확인한다.
- [ ] 오프라인에서 복잡한 동기화 없이 로컬 데이터 기준으로 동작하게 한다.

### 작업 10: UI 다듬기

**파일:**
- 수정: `src/index.css`
- 수정: `src/App.tsx`

- [ ] 심플한 앱형 톤으로 색상, 간격, 카드 높이, 뱃지 스타일을 정리한다.
- [ ] 카드가 세로로 짧게 쌓이는 느낌이 아니라, `가로로 긴 카드` 느낌이 유지되게 조정한다.
- [ ] 모바일 홈 화면에서 열었을 때도 앱처럼 자연스럽게 보이는지 확인한다.
- [ ] 데스크톱 브라우저와 모바일 화면 모두에서 읽기 쉬운지 확인한다.

### 작업 11: 최종 검증

**파일:**
- 테스트: `src/**/*.test.ts*`
- 검증: PWA 설치/오프라인 수동 점검

- [ ] 전체 테스트를 실행한다.
- [ ] 프로덕션 빌드를 실행한다.
- [ ] PWA 설치 가능 여부를 확인한다.
- [ ] 오프라인 진입, 저장된 할 일 조회, 완료 체크를 수동 검증한다.
- [ ] 실패 항목이 있으면 수정 후 다시 검증한다.

---

## 현재 구현 이후 우선 보완할 항목

- [ ] `오늘 성취`와 `완료한 일`을 전체 누적이 아니라 `오늘 기준`으로 집계되게 수정
- [ ] 수동 상태 수정 UI를 `자동 / 켜기 / 끄기`처럼 더 명확하게 바꾸기
- [ ] 상세 화면에서 `내일로 넘기기` 후 저장 시 날짜가 다시 덮어써지지 않게 수정
- [ ] 단계 목록을 읽기 전용이 아니라 직접 추가/수정 가능하게 개선
- [ ] 상세/설정 패널 접근성(`dialog`, `aria-modal`, 키보드 닫기`) 보완
- [ ] 화면에 남아 있는 영문 문구를 모두 한글로 통일
- [ ] PWA 설치 안내 문구와 iPhone 홈 화면 추가 안내 UX 정리
- [ ] 이후 Tauri 래핑 시 재사용 가능한 구조인지 점검
