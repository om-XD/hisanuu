document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HERO BACKGROUND PARALLAX
    ===================================================== */

    const backgroundPhoto = document.querySelector(".background-photo");

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener("mousemove", (e) => {
        if (!backgroundPhoto) return;

        targetX = (e.clientX / window.innerWidth - 0.5) * 25;
        targetY = (e.clientY / window.innerHeight - 0.5) * 25;
    });

    function animateBackground() {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        if (backgroundPhoto) {
            backgroundPhoto.style.transform =
                `scale(1.08) translate(${currentX}px, ${currentY}px)`;
        }

        requestAnimationFrame(animateBackground);
    }

    animateBackground();


    /* =====================================================
       NAVIGATION
    ===================================================== */

    document.querySelectorAll(".nav-links a").forEach((link) => {

        link.addEventListener("click", (e) => {

            const targetID = link.getAttribute("href");

            if (!targetID || !targetID.startsWith("#")) return;

            const target = document.querySelector(targetID);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        });

    });


    /* =====================================================
       SCROLL DOWN
    ===================================================== */

    const scrollIndicator = document.querySelector(".scroll-indicator");

    if (scrollIndicator) {

        scrollIndicator.addEventListener("click", (e) => {

            e.preventDefault();

            const letters = document.querySelector("#letters");

            if (letters) {
                letters.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    }


/* =====================================================
   MEMORIES
   INFINITE PHOTO CHAINS
===================================================== */

const memoryTracks = document.querySelectorAll(".memory-track");

memoryTracks.forEach((track, index) => {

    /* ---------------------------------------------
       Save the original 10 photos
    --------------------------------------------- */

    const originalImages = Array.from(track.children);

    const photoCount = originalImages.length;


    /* ---------------------------------------------
       Create 4 total copies of the photos
    --------------------------------------------- */

    for (let copy = 0; copy < 3; copy++) {

        originalImages.forEach((image) => {

            const clone = image.cloneNode(true);

            clone.setAttribute("aria-hidden", "true");

            track.appendChild(clone);

        });

    }


    /* ---------------------------------------------
       Wait until browser calculates image sizes
    --------------------------------------------- */

    requestAnimationFrame(() => {

        const allImages =
            Array.from(track.children);

        const firstImage =
            allImages[0];

        const imageWidth =
            firstImage.getBoundingClientRect().width;


        const trackStyle =
            window.getComputedStyle(track);


        const gap =
            parseFloat(trackStyle.gap) || 0;


        /*
            Width of ONE complete set of photos.

            10 photos + 9 gaps
        */

        const oneSetWidth =
            (imageWidth * photoCount) +
            (gap * (photoCount - 1));


        /* ---------------------------------------------
           HER
           Moves continuously LEFT
        --------------------------------------------- */

        if (index === 0) {

            let position = 0;

            function moveHer() {

                position -= 0.45;


                /*
                    Once ONE complete set has moved away,
                    bring it back by exactly one set width.

                    Because identical photos are behind it,
                    the viewer never sees the reset.
                */

                if (position <= -oneSetWidth) {

                    position += oneSetWidth;

                }


                track.style.transform =
                    `translate3d(${position}px, 0, 0)`;


                requestAnimationFrame(moveHer);

            }

            moveHer();

        }


        /* ---------------------------------------------
           US
           Moves continuously RIGHT
        --------------------------------------------- */

        else {

            let position = -oneSetWidth;

            function moveUs() {

                position += 0.45;


                /*
                    When the chain reaches the beginning,
                    move it back by exactly one set.
                */

                if (position >= 0) {

                    position -= oneSetWidth;

                }


                track.style.transform =
                    `translate3d(${position}px, 0, 0)`;


                requestAnimationFrame(moveUs);

            }

            moveUs();

        }

    });

});

    /* =====================================================
       SONG PLAYER
    ===================================================== */

    const songElements = document.querySelectorAll(".song");

    songElements.forEach((song) => {

        const audio = song.querySelector("audio");
        const button = song.querySelector(".play-button");

        if (!audio || !button) return;

        button.addEventListener("click", (e) => {

            e.stopPropagation();

            if (!audio.paused) {

                audio.pause();

                button.textContent = "▶";

                song.classList.remove("playing");

                return;
            }


            /* Pause all other songs */

            songElements.forEach((otherSong) => {

                const otherAudio = otherSong.querySelector("audio");
                const otherButton = otherSong.querySelector(".play-button");

                if (otherAudio && otherAudio !== audio) {
                    otherAudio.pause();
                    otherAudio.currentTime = 0;
                }

                if (otherButton && otherButton !== button) {
                    otherButton.textContent = "▶";
                }

                otherSong.classList.remove("playing");

            });


            /* Play selected song */

            audio.play()
                .then(() => {

                    button.textContent = "❚❚";
                    song.classList.add("playing");

                })
                .catch((error) => {

                    console.error("Audio could not play:", error);

                });

        });


        audio.addEventListener("ended", () => {

            button.textContent = "▶";
            song.classList.remove("playing");

        });

    });


    /* =====================================================
       OPEN WHEN
    ===================================================== */

    const envelopes = document.querySelectorAll(".envelope");

    const envelopeMessage =
        document.querySelector("#envelopeMessage");

    const messageText =
        document.querySelector("#messageText");

    const closeMessage =
        document.querySelector("#closeMessage");


    envelopes.forEach((envelope) => {

        envelope.addEventListener("click", () => {

            const message = envelope.getAttribute("data-message");

            if (!message || !envelopeMessage || !messageText) {
                return;
            }

            messageText.textContent = message;

            envelopeMessage.classList.add("show");

            document.body.style.overflow = "hidden";

        });

    });


    /* CLOSE MESSAGE */

    if (closeMessage && envelopeMessage) {

        closeMessage.addEventListener("click", () => {

            envelopeMessage.classList.remove("show");

            document.body.style.overflow = "";

        });

    }


    /* CLICK OUTSIDE MESSAGE */

    if (envelopeMessage) {

        envelopeMessage.addEventListener("click", (e) => {

            if (e.target === envelopeMessage) {

                envelopeMessage.classList.remove("show");

                document.body.style.overflow = "";

            }

        });

    }


    /* =====================================================
       VIDEOS
    ===================================================== */

    const videoLink = document.querySelector(".video-link");
    const videosSection = document.querySelector("#videos");
    const closeVideos = document.querySelector("#closeVideos");

    if (videoLink && videosSection) {

        videoLink.addEventListener("click", (e) => {

            e.preventDefault();

            videosSection.classList.add("show");

            document.body.style.overflow = "hidden";

        });

    }

    if (closeVideos && videosSection) {

        closeVideos.addEventListener("click", () => {

            videosSection.classList.remove("show");

            document.body.style.overflow = "";

            videosSection.querySelectorAll("video").forEach((video) => {
                video.pause();
            });

        });

    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            if (envelopeMessage) {
                envelopeMessage.classList.remove("show");
            }

            if (videosSection) {
                videosSection.classList.remove("show");
            }

            document.body.style.overflow = "";

        }

    });


    /* =====================================================
       VIDEO PLAYBACK
    ===================================================== */

    const videos =
        document.querySelectorAll(".video-item video");

    videos.forEach((video) => {

        video.addEventListener("play", () => {

            videos.forEach((otherVideo) => {

                if (otherVideo !== video) {
                    otherVideo.pause();
                }

            });

        });

    });


    /* =====================================================
       IMAGE ERROR CHECK
    ===================================================== */

    document.querySelectorAll("img").forEach((image) => {

        image.addEventListener("error", () => {

            console.warn(
                "Image could not be loaded:",
                image.src
            );

        });

    });


    console.log("❤️ Birthday website loaded successfully.");

});