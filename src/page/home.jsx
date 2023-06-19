import './style/style.css'
import './style/index.css'

export default function Index(props) {
    return (
        <div className="home">
            <div className="top-banner"></div>

            <div className="home-container">
                {/*<h1>Noctura</h1>
                <input placeholder="Enter URL or Search Query"/>*/}
            </div>

            <div className="home-footer">
                <span className="server-indicator">
                    Server:
                    <span className={"server-indicator-value"}><span className="indicator-dot"></span>Connecting...<span className="server-name"></span></span>
                </span>
            </div>
        </div>
    )
}