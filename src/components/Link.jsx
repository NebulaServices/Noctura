import flame from 'flamethrower-router';
let flamethrower;

if (typeof window !== 'undefined') {
<<<<<<< HEAD
    flamethrower = flame({log: false, prefetch: 'visible'});
=======
    flamethrower = flame({log: false});
>>>>>>> 3ed04a5d1242389e78f1850286d0af5740bf3da7
}

export default function Link(props) {
    const _onClick = props.onClick;

    const handler = (e) => {
        if (_onClick) _onClick(e);

        if (flamethrower) {
<<<<<<< HEAD
            if (props.href.startsWith('http://') || props.href.startsWith('https://') && !props.href.startsWith(location.origin)) return;
=======
            if ((props.href.startsWith('http://') || props.href.startsWith('https://') || props.href.match(/^(mailto:|javascript:|about:)/g)) && !props.href.startsWith(location.origin)) return;
>>>>>>> 3ed04a5d1242389e78f1850286d0af5740bf3da7

            e.preventDefault();

            return flamethrower.go(props.href);
        }
    }

    return (
        <a onClick={handler} {...props} target={props.target || '_self'}>
            {props.children}
        </a>
    )
}