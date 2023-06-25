import './footer.css';

export default function Footer(props) {
    return (
        <div className="site-footer">
            <div className="top-banner" />
            <div className="footer-container">
                <div className="footer-section">
                    <h1><img src="/transparent-favicon.png" />Noctura</h1>
                    <p>© 2023 Noctura. All rights reserved.</p>
                </div>
                <div className="footer-section">
                    <div className="flex-footer-container">
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/console">Console</a></li>
                            <li><a href="/games">Games</a></li>
                        </ul>

                        <ul>
                            <li><a href="/settings">Settings</a></li>
                            <li><a href="/docs">Docs</a></li>
                            <li><a href="/ai">AI</a></li>
                        </ul>
                        
                        <ul>
                            <li><a href="/media">Media</a></li>
                            <li><a href="/changelog">Changes</a></li>
                            <li><a href="/help">Help</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-section">
                    <ul>
                        <li><a href="https://titaniumnetwork.org">TitaniumNetwork</a></li>
                        <li><a href="https://docs.titaniumnetwork.org">Oxide Docs</a></li>
                        <li><a href="https://github.com/titaniumnetwork-dev/">Source Code</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <ul>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <ul>
                        <li><a href="mailto:akane@noctura.tech">Email</a></li>
                        <li><a href="phone:">Phone</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}