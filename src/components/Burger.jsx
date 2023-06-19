import './burger.css'

export default function Burger(props) {
    if (typeof window !== 'undefined') {
        addEventListener('mousedown', (e) => {
            const burger = document.getElementsByClassName('burger-container')[0];
            const menu = document.getElementsByClassName('burger-child-container')[0];
            const bounds = menu.getBoundingClientRect();

            if (e.target.parentNode ==  burger || e.target == burger) return;

            if ((e.clientX <= bounds.left || e.clientX >= bounds.right) || (e.clientY <= bounds.top || e.clientY >= bounds.bottom)) {
                addEventListener('mouseup', (e) => {
                    e.stopPropagation();
                    toggle(e, true);
                }, { once: true });
            }
        });
    }

    const toggle = (e, only = false) => {
        if (!only && e.target.parentNode !== document.getElementsByClassName('burger-container')[0] && e.target !== document.getElementsByClassName('burger-container')[0]) return;

        const one = document.getElementById('_b1');
        const two = document.getElementById('_b2');
        const three = document.getElementById('_b3');

        if (one.classList.contains('burger-line-1-active')) {
            one.classList.remove('burger-line-1-active');
            two.classList.remove('burger-line-2-active');
            three.classList.remove('burger-line-3-active');

            if (document.getElementsByClassName('burger-child-container')[0]) document.getElementsByClassName('burger-child-container')[0].classList.remove('burger-child-container-active');
            if (document.getElementsByClassName('burger-child-container')[0]) document.getElementsByClassName('burger-child-container')[0].style.left = '';

            setTimeout(function() {
                if (document.getElementsByClassName('burger-child-container')[0]) document.getElementsByClassName('burger-child-container')[0].style.display = 'none';
            }, 200);
        } else if (!only) {
            one.classList.add('burger-line-1-active');
            two.classList.add('burger-line-2-active');
            three.classList.add('burger-line-3-active');

            if (document.getElementsByClassName('burger-child-container')[0]) document.getElementsByClassName('burger-child-container')[0].style.display = 'block';

            if (document.getElementsByClassName('burger-child-container')[0]) {
                var a = document.getElementsByClassName('burger-child-container')[0];
                var bounds = a.getBoundingClientRect();

                var parentBounds = a.parentNode.getBoundingClientRect();

                a.style.left = `${((e.clientX - bounds.width - parentBounds.left) / 2) + parentBounds.width + 10}px`;
            }

            requestAnimationFrame(() => {
                if (document.getElementsByClassName('burger-child-container')[0]) document.getElementsByClassName('burger-child-container')[0].classList.add('burger-child-container-active');
            });
        }
    }

    return (
        <>
            <div className="burger-container" onClick={toggle}>
                <span id="_b1" className="burger-line-1"></span>
                <span id="_b2" className="burger-line-2"></span>
                <span id="_b3" className="burger-line-3"></span>

                <div className="burger-child-container" style={{background: props.background || '#000'}}>
                    {props.children}
                </div>
            </div>
        </>
    )
}