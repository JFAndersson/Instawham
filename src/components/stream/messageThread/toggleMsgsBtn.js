function ToggleMessagesBtn(props){
    
    if (props.messages){
        if (props.messages.length > 2 && !props.showAllMessages){
            return <button className='comments-btn' onClick={() => props.setShowAllMessages(true)}>Show more comments</button>;
        }
        else if (props.messages.length > 2 && props.showAllMessages){
            return <button className='comments-btn' onClick={() => props.setShowAllMessages(false)}>Show fewer comments</button>;
        }
    }
}

export default ToggleMessagesBtn;