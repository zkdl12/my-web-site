let isDragging = false;
let startPos = { r: 0, c: 0 };
let score = 0;
const grid = document.getElementById('fruit-grid');

function initGame() {
    grid.innerHTML = '';
    score = 0;
    document.getElementById('score').innerText = score;

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 17; c++) {
            const num = Math.floor(Math.random() * 9) + 1;
            const fruit = document.createElement('div');
            fruit.className = 'fruit';
            fruit.dataset.r = r; 
            fruit.dataset.c = c;
            fruit.dataset.val = num;
            
            // 숫자 전용 span 생성
            const numSpan = document.createElement('span');
            numSpan.className = 'fruit-num';
            numSpan.innerText = num;
            fruit.appendChild(numSpan);
            
            fruit.addEventListener('mousedown', (e) => {
                isDragging = true;
                startPos = { r, c };
                e.preventDefault();
            });
            
            fruit.addEventListener('mouseenter', () => updateDrag(r, c));
            grid.appendChild(fruit);
        }
    }
}

function updateDrag(currR, currC) {
    if (!isDragging) return;
    
    // 이전 선택 초기화
    document.querySelectorAll('.fruit').forEach(f => f.classList.remove('selected'));
    
    const minR = Math.min(startPos.r, currR);
    const maxR = Math.max(startPos.r, currR);
    const minC = Math.min(startPos.c, currC);
    const maxC = Math.max(startPos.c, currC);

    let currentSum = 0;
    let selectedList = [];

    document.querySelectorAll('.fruit').forEach(f => {
        const r = parseInt(f.dataset.r);
        const c = parseInt(f.dataset.c);
        if (r >= minR && r <= maxR && c >= minC && c <= maxC && !f.classList.contains('removed')) {
            f.classList.add('selected');
            currentSum += parseInt(f.dataset.val);
            selectedList.push(f);
        }
    });

    // 합이 정확히 10이면 제거
    if (currentSum === 10) {
        selectedList.forEach(f => f.classList.add('removed'));
        score += selectedList.length;
        document.getElementById('score').innerText = score;
        isDragging = false;
    }
}

window.addEventListener('mouseup', () => {
    isDragging = false;
    document.querySelectorAll('.fruit').forEach(f => f.classList.remove('selected'));
});

// 시작
initGame();