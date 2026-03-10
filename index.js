addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000, {x: 100, y: 20})
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndScale(block);
            resetFadeOut(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });


    let heartBeatingAnimation = null;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingAnimation = animaster().heartBeating(block, 1000);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (heartBeatingAnimation !== null) {
                heartBeatingAnimation.stop();
            }
        });
}

function animaster () {
    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function _move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }
    function move(element, duration, translation) {
        this.addMove(duration, translation).play(element);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }
    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function addMove(duration, translation) {
        this._steps.push({
            type: 'move',
            duration: duration,
            translation: translation
        });

        return this;
    }

    function play(element) {
        let delay = 0;

        for (const step of this._steps) {
            setTimeout(() => {

                switch (step.type) {
                    case 'move':
                        _move(element, step.duration, step.translation);
                        break;

                    case 'scale':
                        scale(element, step.duration, step.ratio);
                        break;

                    case 'fadeIn':
                        fadeIn(element, step.duration);
                        break;

                    case 'fadeOut':
                        fadeOut(element, step.duration);
                        break;
                }
            }, delay);

            delay += step.duration;
            this._steps = [];
        }
    }
    function moveAndHide(element, duration, translation) {
        _move(element, duration * 2/5, translation);
        setTimeout(() => fadeOut(element, duration * 3/5), duration * 2/5);
    }
    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(() => {
            fadeOut(element, duration / 3);
        }, duration / 3);
    }
    function heartBeating(element, duration) {
        const interval = setInterval(() => {
            scale(element, duration / 2, 1.4);

            setTimeout(() => {
                scale(element, duration / 2, 1);
            }, duration / 2);

        }, duration);

        return {
            stop() {
                clearInterval(interval);
            }
        };
    }

    const animator = {};
    animator.fadeIn = fadeIn;
    animator.scale = scale;
    animator.move = move;
    animator.fadeOut = fadeOut;
    animator.moveAndHide = moveAndHide;
    animator.heartBeating = heartBeating;
    animator.showAndHide = showAndHide;
    animator.addMove = addMove;
    animator.play = play;

    animator._steps = []


    return animator;

}

function resetFadeIn (element) {
    element.style.transitionDuration = null;
    element.classList.remove('show');
    element.classList.add('hide');
}

function resetFadeOut (element) {
    element.style.transitionDuration = null;
    element.classList.remove('hide');
    element.classList.add('show');
}

function resetMoveAndScale (element) {
    element.style.transitionDuration = null;
    element.style.transform = null;
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
