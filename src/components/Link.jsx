import flame from 'flamethrower-router';
let flamethrower;

if (typeof window !== 'undefined') {
    flamethrower = flame({log: false});
}

export default function Link(props) {
    const _onClick = props.onClick;

    const handler = (e) => {
        if (_onClick) _onClick(e);

        if (flamethrower) {
            if ((props.href.startsWith('http://') || props.href.startsWith('https://') || props.href.match(/^(mailto:|javascript:|about:)/g)) && !props.href.startsWith(location.origin)) return;

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