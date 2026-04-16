---
name: dino-step-guide
description: Promo Dino Game 구현 Step 가이드. `docs/promo-dino-game-steps.md`의 진행 상황을 추적하고 다음 Step을 안내하며 구현을 가이드한다. 사용자가 '다음 스텝', '스텝 진행', '구현 시작', '현재 진행 상황', 'step' 등을 언급하면 이 스킬을 사용한다. 별도 스텝 지정 없이 구현을 요청하면 자동으로 다음 미완료 Step을 찾아 진행한다.
---

# Dino Step Guide

Promo Dino Game 구현 Step을 순서대로 진행하기 위한 가이드 스킬.

## 워크플로우

### 1. 현재 진행 상황 파악

`docs/promo-dino-game-steps.md`를 읽고 체크박스(`- [ ]` vs `- [x]`)를 확인하여 진행 상황을 파악한다.

- 모든 체크박스가 `- [x]`인 Step → 완료
- 하나라도 `- [ ]`가 남아있는 Step → 미완료
- 첫 번째 미완료 Step이 **현재 진행할 Step**

사용자에게 현재 상태를 간결하게 보고한다:
```
## 진행 상황
- Step 1-1 ~ 1-3: ✅ 완료
- **Step 1-4**: 🔄 진행 대상
- Step 1-5 ~ 5-3: ⬜ 대기
```

### 2. Step 컨텍스트 로드

진행할 Step이 결정되면:

1. Step 문서에서 해당 Step의 **참고 파일** 목록을 읽는다
2. 참고 파일들을 실제로 Read하여 현재 코드 상태를 파악한다
3. **수정/생성 대상 파일**도 존재하면 Read한다
4. `docs/promo-dino-game-dev.md`에서 해당 Step이 참조하는 섹션을 Read한다

이 컨텍스트를 바탕으로 구현을 시작한다. 참고 파일이 많으면 Explore 에이전트를 활용한다.

### 3. 구현

Step의 **작업 내용**을 순서대로 수행한다.

핵심 원칙:
- 각 Step 완료 후 게임이 정상 동작해야 한다
- **Additive first**: 새 코드 추가 먼저, 기존 코드 제거는 모든 소비자 전환 후
- Step 문서의 작업 내용을 따르되, 현재 코드 상태에 맞게 조정한다
- 한 Step 내에서도 파일 단위로 나눠서 동작 확인이 가능하도록 진행한다

### 4. 검증

Step의 **완료 조건** 체크리스트를 하나씩 확인한다.

검증 방법:
- 코드 레벨: 파일 참조 에러 없음, import 정합성 확인
- 런타임: 개발 서버를 실행하여 브라우저에서 게임 동작 확인
- 마지막 조건은 항상 **"게임 플레이가 정상 동작한다"** — 이것이 가장 중요

검증이 완료되면 사용자에게 결과를 보고하고 확인을 요청한다.

### 5. 완료 표시

사용자가 검증 완료를 확인하면:

1. `docs/promo-dino-game-steps.md`에서 해당 Step의 `- [ ]`를 모두 `- [x]`로 변경한다
2. 사용자에게 커밋 여부를 물어본다

### 6. 다음 Step 안내

완료 표시 후, 다음 Step이 있으면 간략히 안내한다:
- 다음 Step 제목과 목표
- 열린 결정 사항이 있으면 미리 알린다
- 사용자가 바로 이어서 진행할지 물어본다

## 특정 Step 지정

사용자가 특정 Step을 지정하면 (예: "Step 1-4 진행해줘") 해당 Step부터 시작한다. 단, 이전 Step이 완료되지 않았으면 경고한다.

## 참고 문서 경로

- 구현 Step 문서: `docs/promo-dino-game-steps.md`
- 개발 상세 문서: `docs/promo-dino-game-dev.md`
- 기획 문서: `docs/promo-dino-game-spec.md`
- Figma: https://www.figma.com/design/gsANyIQ6n0utFXjlexeXq5/Untitled?node-id=23-407
