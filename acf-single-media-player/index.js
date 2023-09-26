const mediaPlayer = () => {
	const selectors = ['.now-playing', '.track-name', '.track-artist', '.playpause-track', '.next-track', '.prev-track', '.repeat-track', '.seek_slider', '.volume_slider', '.current-time', '.total-duration', '.media-player-data'];
	const mediaPlayerSectionNodes = document.querySelectorAll('.media-player');

	for (const mediaPlayersSection of mediaPlayerSectionNodes) {
		const [nowPlaying, trackName, trackArtist, playPauseBtn, nextBtn, prevBtn, repeatBtn, seekSlider, volumeSlider, currTime, totalDuration, mediaData] = selectors.map(selector => mediaPlayersSection.querySelector(selector));

		let trackIndex = 0;
		let isPlaying = false;
		let updateTimer;
		const trackListArray = JSON.parse(mediaData.value);
		const currTrack = new Audio();

		const loadTrack = index => {
			clearInterval(updateTimer);
			resetValues();

			const track = trackListArray[index];
			currTrack.src = track.media;
			currTrack.load();

			trackName.textContent = track.title;
			trackArtist.textContent = track.subtitle;
			nowPlaying.textContent = `Część ${index + 1} z ${trackListArray.length}`;

			updateTimer = setInterval(seekUpdate, 1000);

			currTrack.addEventListener('ended', nextTrack);
		};

		const resetValues = () => {
			currTime.textContent = '00:00';
			totalDuration.textContent = '00:00';
			seekSlider.value = 0;
		};

		const playpauseTrack = () => {
			isPlaying ? pauseTrack() : playTrack();
		};

		const repeatTrack = () => {
			if (currTrack.currentTime > 0) {
				currTrack.currentTime = 0;
				playTrack();
			}
		};

		const playTrack = () => {
			currTrack.play();
			isPlaying = true;
			updatePlayPauseBtn();
		};

		const pauseTrack = () => {
			currTrack.pause();
			isPlaying = false;
			updatePlayPauseBtn();
		};

		const updatePlayPauseBtn = () => {
			playPauseBtn.innerHTML = isPlaying ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <g id="pause 1" clip-path="url(#clip0_2267_22785)"> <path id="Vector" d="M8.4375 0.625H2.96875V19.375H8.4375V0.625Z" fill="white"></path> <path id="Vector_2" d="M17.0313 0.625H11.5625V19.375H17.0313V0.625Z" fill="white"></path> </g> <defs> <clipPath id="clip0_2267_22785"> <rect width="18.75" height="18.75" fill="white" transform="translate(0.625 0.625)"></rect> </clipPath> </defs> </svg>' : '<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"> <g id="Artboard1" transform="matrix(1.2,0,0,1.2,-429.6,-61.2)"> <rect x="358" y="51" width="20" height="20" style="fill:none;"></rect> <g transform="matrix(0.0543485,0,0,0.0543485,354.228,47.0866)"> <path d="M133,440C126.861,439.989 120.829,438.379 115.5,435.33C103.5,428.53 96.04,415.33 96.04,401L96.04,111C96.04,96.63 103.5,83.47 115.5,76.67C126.598,70.292 140.336,70.465 151.27,77.12L399.12,225.48C409.609,232.057 415.995,243.6 415.995,255.98C415.995,268.36 409.609,279.903 399.12,286.48L151.23,434.88C145.729,438.205 139.428,439.975 133,440Z" style="fill:white;fill-rule:nonzero;"></path> </g> </g> </svg>';
		};

		const nextTrack = () => {
			trackIndex = (trackIndex + 1) % trackListArray.length;
			loadTrack(trackIndex);
			playTrack();
		};

		const prevTrack = () => {
			trackIndex = (trackIndex - 1 + trackListArray.length) % trackListArray.length;
			loadTrack(trackIndex);
			playTrack();
		};

		const seekTo = () => {
			currTrack.currentTime = currTrack.duration * (seekSlider.value / 100);
		};

		const setVolume = () => {
			currTrack.volume = volumeSlider.value / 100;
		};

		const seekUpdate = () => {
			if (!isNaN(currTrack.duration)) {
				seekSlider.value = currTrack.currentTime * (100 / currTrack.duration);

				const currentMinutes = Math.floor(currTrack.currentTime / 60);
				const currentSeconds = Math.floor(currTrack.currentTime % 60);
				const durationMinutes = Math.floor(currTrack.duration / 60);
				const durationSeconds = Math.floor(currTrack.duration % 60);

				currTime.textContent = `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
				totalDuration.textContent = `${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
			}
		};

		const isIOS = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

		if (isIOS) {
			const elementToHide = document.querySelector('.media-player__player--volume');
			if (elementToHide) {
				elementToHide.style.display = 'none';
			}
		}

		playPauseBtn.addEventListener('click', playpauseTrack);
		nextBtn.addEventListener('click', nextTrack);
		prevBtn.addEventListener('click', prevTrack);
		repeatBtn.addEventListener('click', repeatTrack);
		seekSlider.addEventListener('input', seekTo);
		volumeSlider.addEventListener('input', setVolume);

		loadTrack(trackIndex);
	}
};

mediaPlayer();

if (window.acf) {
	window.acf.addAction('render_block_preview/type=mediaplayer', mediaPlayer);
}