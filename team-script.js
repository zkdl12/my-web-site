/**
 * ANI WORLD Team Builder - JS 최종본
 * 기능: CK(라인별 고정 섞기), 솔랭(전체 랜덤 섞기), 섞기 횟수 카운트
 */

let currentMode = ''; 
let shuffleCount = 0; // 섞은 횟수 카운터
const lanes = ['탑', '정글', '미드', '원딜', '서폿'];

// 1. 모드 시작 (CK 또는 솔랭 선택)
function startMode(mode) {
    currentMode = mode;
    shuffleCount = 0; // 모드 변경 시 횟수 초기화
    updateShuffleDisplay();
    
    document.getElementById('mode-selection').style.display = 'none';
    document.getElementById('builder-area').style.display = 'block';
    
    // 탭 콘텐츠 활성화
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('tab-' + mode).classList.add('active');
    
    // 제목 변경
    document.getElementById('page-title').innerText = mode === 'ck' ? 'CK 팀 섞기' : '솔랭 내기';

    if(mode === 'ck') {
        generateCkRows();
    } else {
        generateSoloRows(); // 솔랭은 기본 1:1로 생성
    }
}

// 2. CK용 라인 생성 (탑~서폿 고정)
function generateCkRows() {
    const cont = document.getElementById('lane-rows-ck');
    cont.innerHTML = lanes.map((lane) => `
        <div class="lane-row">
            <div class="lane-tag">${lane}</div>
            <input type="text" class="player-input blue-in" placeholder="블루">
            <button class="lock-btn" onclick="this.classList.toggle('active')">🔓</button>
            <input type="text" class="player-input red-in" placeholder="레드">
        </div>
    `).join('');
}

// 3. 솔랭용 라인 생성 (번호 기반, 인원 가변)
function generateSoloRows() {
    const count = document.getElementById('solo-count').value;
    const cont = document.getElementById('lane-rows-solo');
    let html = '';
    for(let i=1; i<=count; i++) {
        html += `
            <div class="lane-row">
                <div class="lane-tag">${i}번</div>
                <input type="text" class="player-input blue-in" placeholder="A팀">
                <button class="lock-btn" onclick="this.classList.toggle('active')">🔓</button>
                <input type="text" class="player-input red-in" placeholder="B팀">
            </div>`;
    }
    cont.innerHTML = html;
}

// 4. 팀 섞기 핵심 로직 (모드별 분리)
function shuffleTeams() {
    const activeTab = document.querySelector('.tab-content.active');
    const rows = activeTab.querySelectorAll('.lane-row');
    
    if (currentMode === 'ck') {
        // [CK 모드] 각 라인 내에서 블루/레드 상대끼리만 교체
        rows.forEach(row => {
            const lockBtn = row.querySelector('.lock-btn');
            if (!lockBtn.classList.contains('active')) {
                const inputs = row.querySelectorAll('.player-input');
                // 50% 확률로 두 입력값의 위치를 바꿈
                if (Math.random() > 0.5) {
                    const temp = inputs[0].value;
                    inputs[0].value = inputs[1].value;
                    inputs[1].value = temp;
                }
            }
        });
    } else {
        // [솔랭 모드] 잠금되지 않은 모든 인원을 한데 모아 전체 랜덤 섞기
        const blues = activeTab.querySelectorAll('.blue-in');
        const reds = activeTab.querySelectorAll('.red-in');
        const locks = activeTab.querySelectorAll('.lock-btn');
        let pool = [];

        // 데이터 수집
        locks.forEach((lock, i) => {
            if (!lock.classList.contains('active')) {
                if(blues[i].value) pool.push(blues[i].value);
                if(reds[i].value) pool.push(reds[i].value);
            }
        });

        // 무작위 정렬
        pool.sort(() => Math.random() - 0.5);

        // 재배치
        let idx = 0;
        locks.forEach((lock, i) => {
            if (!lock.classList.contains('active')) {
                blues[i].value = pool[idx++] || "";
                reds[i].value = pool[idx++] || "";
            }
        });
    }

    // 섞은 횟수 카운트 및 표시 업데이트
    shuffleCount++;
    updateShuffleDisplay();
}

// 5. 섞은 횟수 화면 업데이트
function updateShuffleDisplay() {
    const wrapper = document.querySelector('.shuffle-count-wrapper');
    const display = document.getElementById('shuffle-count-display');
    if (shuffleCount > 0) {
        wrapper.style.display = 'block';
        display.innerText = shuffleCount;
    } else {
        wrapper.style.display = 'none';
    }
}

// 6. 초기화 함수
function resetInputs() {
    document.querySelectorAll('.player-input').forEach(input => input.value = '');
    document.querySelectorAll('.lock-btn').forEach(btn => btn.classList.remove('active'));
    shuffleCount = 0;
    updateShuffleDisplay();
}

// 7. 메뉴 이동 및 뒤로가기 분기
function goBackToMenu() {
    if(document.getElementById('mode-selection').style.display === 'none') {
        document.getElementById('mode-selection').style.display = 'flex';
        document.getElementById('builder-area').style.display = 'none';
        document.getElementById('page-title').innerText = '모드를 선택해주세요';
        shuffleCount = 0;
        updateShuffleDisplay();
    } else {
        location.href = 'index.html';
    }
}

// 8. 결과 복사 기능
function copyResult() {
    let text = `💖 [ ANI WORLD ${currentMode === 'ck' ? 'CK' : '솔랭'} 결과 ] 💖\n`;
    text += `(섞은 횟수: ${shuffleCount}회)\n\n`;
    
    const activeTab = document.querySelector('.tab-content.active');
    const rows = activeTab.querySelectorAll('.lane-row');
    
    rows.forEach((row) => {
        const tag = row.querySelector('.lane-tag').innerText;
        const inputs = row.querySelectorAll('.player-input');
        const team1 = inputs[0].value || '??';
        const team2 = inputs[1].value || '??';
        text += `${tag}: ${team1} vs ${team2}\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
        alert("결과가 복사되었습니다! ✨");
    });
}