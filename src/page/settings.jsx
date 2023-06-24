import { title_cloak } from './scripts/settings';
import { ab_cloak } from './scripts/settings.js';
import './style/style.css';

export default function Settings(props) {
    return (
        <div>
    <div className="top-banner"></div>
    <div className="container">
        <div className="cloak">
            <h1>Cloaking</h1>
        </div>
            <div className="button-container">
                <div className="ab">
                    <button onClick={ab_cloak}>About:blank Cloaker</button>
                </div>
            <div className='title'>
                <button onClick={title_cloak}>Title Cloaker</button>
            </div>
        </div>
    </div>
</div>

    );
}
