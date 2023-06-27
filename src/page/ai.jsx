import './style/style.css'
import './style/ai.css';

export default function AI(props) {
    return (
        <div>
            <div className="top-banner"></div>
            <div className="chat-history"></div>
            <div className="main-content">
                <div className="answer-box"></div>
                <div className="message-box">
                    <input></input>
                    <a type="submit" className="send-img">
                    <img src="/send-icon.png"></img>
                    
                    </a>
                    
                </div>
            </div>
        </div>
    )
}