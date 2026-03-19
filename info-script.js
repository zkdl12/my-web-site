window.onload = function() {
    const videoContainer = document.getElementById('video-container');
    
    // 임아니님 채널의 '업로드' 플레이리스트 ID입니다.
    // 이 방식을 사용하면 채널에 새 영상이 올라올 때마다 자동으로 첫 번째 영상이 바뀝니다.
    const playlistId = 'UULm697m97ZxlW_p630I-pZg'; // 채널 ID의 UC를 UU로 바꾼 값

    if (videoContainer) {
        videoContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed?listType=playlist&list=${playlistId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }
};